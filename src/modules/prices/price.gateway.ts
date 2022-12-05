import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'
import { Socket } from 'socket.io'

import { PricesService } from '@MODULES/prices/services/prices.service'
import { MonitorService } from '@MODULES/prices/services/monitor.service'

@WebSocketGateway()
export class PriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket
  private logger: (message: string | object) => void
  private clients: TClient = new Map()

  constructor(
    private readonly pricesService: PricesService,
    private readonly monitorService: MonitorService,
    private readonly config: ConfigService,
    private readonly http: HttpService
  ) {
    this.logger = message => {
      const env = this.config.get<TEnv>('NODE_ENV')
      if (env === 'development') new Logger('WEB_SOCKET').log(message)
    }
  }

  handleConnection({ id }: Socket) {
    this.clients.set(id, { id, channels: [] })
    this.logger(`Client connected "${id}"`)
  }

  handleDisconnect({ id }: Socket) {
    this.clients.delete(id)
    this.logger(`Client disconnected: "${id}"`)
    if (!this.clients.size) this.monitorService.off()
  }

  @SubscribeMessage('prices')
  private prices(@MessageBody() { clientId, query }: TPayload): void {
    if (!this.monitorService.isRun()) this.emitPrices()
    const event = `prices:${query.qty}:sources:${query.source}`

    this.clients.forEach(client => {
      if (client.id === clientId) {
        client.channels.push({ query, event })
        this.logger(`Event added: "${event}" to client "${client.id}"`)
      }
    })
  }

  private emitPrices(): void {
    this.monitorService.run(async () => {
      try {
        const { data } = await firstValueFrom(
          this.http.get<TServiceResponse>('/api/update_data').pipe(
            catchError(error => {
              const errorMessage = error?.response?.data.error || error.message
              throw new Error(`Error request: ${errorMessage}`)
            })
          )
        )

        // TODO: Por ahora mostrar esto aqui, luego se debe guardar todo logger en DB
        console.log(data.response)

        await Promise.allSettled(
          this.getTotalChannels().map(async ({ query, event }) => {
            try {
              const { qty, source } = query
              const data = source
                ? await this.pricesService.findPricesBySource(qty, source)
                : await this.pricesService.findPrices(qty)

              this.server.emit(event, {
                response: `Prices of ${source}`,
                data
              })
            } catch (error) {
              new Logger('WEB_SOCKET').error(error)

              this.server.emit(event, {
                response: 'Error',
                data: null,
                error
              })
            }
          })
        )
      } catch (error) {
        new Logger(PriceGateway.name).error((error as Error)?.message)
        return
      }
    })
  }

  private getTotalChannels(): TChannel[] {
    let totalChannels: TChannel[] = []

    this.clients.forEach(({ channels }) => {
      for (const channel of channels) {
        const events = totalChannels.map(({ event }) => event)
        const isEvent = events.includes(channel.event)
        if (!isEvent) totalChannels.push(channel)
      }
    })

    return totalChannels
  }
}
