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
import { QueryPriceDto } from '@MODULES/prices/dto'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({
  // TODO: estudiar la posibilidad de usar namespaces y rooms
  // namespace: 'prices'
})
export class PriceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket
  private logger: (message: string) => void
  private channels: { event: string; query: QueryPriceDto }[] = []
  private clients: Map<string, {}> = new Map()

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

  handleConnection(client: Socket) {
    this.clients.set(client.id, null)
    this.logger(`Client "${client.id}" connected`)
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id)
    this.logger(`Client "${client.id}" disconnected`)
    if (!this.clients.size) this.monitorService.off()
  }

  @SubscribeMessage('prices')
  private prices(@MessageBody() query: QueryPriceDto): void {
    if (this.clients.size === 1) this.emitPrices()

    this.channels.push({
      event: `prices:${query.qty}:sources:${query.source}`,
      query
    })
  }

  private emitPrices(): void {
    this.monitorService.run(async () => {
      const pricePromises = this.channels.map(({ event, query }) => {
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
}
