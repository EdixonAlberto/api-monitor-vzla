import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { PricesService } from '@MODULES/prices/services/prices.service'
import { MonitorService } from '@MODULES/prices/services/monitor.service'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({
  // TODO: estudiar la posibilidad de usar namespaces y rooms
  // namespace: 'prices'
})
export class PriceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket
  private logger: (message: string) => void
  private clients: TClient = new Map()

  constructor(
    private readonly pricesService: PricesService,
    private readonly monitorService: MonitorService,
    private readonly config: ConfigService
  ) {
    this.logger = (message: string) => {
      const env = this.config.get<TEnv>('NODE_ENV')
      if (env === 'development') new Logger('WEB_SOCKET').log(message)
    }
  }

  async afterInit() {
    this.logger(`Websocket listening in port ${this.config.get<string>('PORT_WS')}`)
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
    if (this.clients.size === 1) this.emitPrices()
    const event = `prices:${query.qty}:sources:${query.source}`

    this.clients.forEach(client => {
      if (client.id === clientId) client.channels.push({ query, event })
    })
  }

  private emitPrices(): void {
    this.monitorService.run(async () => {
      const pricePromises = this.getTotalChannels().map(({ query, event }) => {
        return new Promise(async resolve => {
          try {
            const { qty, source } = query
            const data = await this.pricesService.findPriceBySource(qty, source)
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

          resolve(null)
        })
      })

      await Promise.allSettled(pricePromises)
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
