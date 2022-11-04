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
import { PricesService } from './services/prices.service'
import { MonitorService } from './services/monitor.service'
import { QueryPriceDto } from '@MODULES/prices/dto'
import { ConfigService } from '@nestjs/config'

// TODO: usar variables de entorno para configurar el gateway de websocket
@WebSocketGateway(3002, {
  // TODO: estudiar la posibilidad de usar namespaces y rooms
  // namespace: 'prices',

  // TODO: estudiar sobre transports
  // transports: ['websocket'],
  cors: {
    origin: '*'
  }
})
export class PriceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket
  private logger: (message: string) => void
  private channels: { channel: string; query: QueryPriceDto }[] = []

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

  async afterInit(server: Socket) {
    this.logger(`WebSocket listening in port ${process.env.PORT_WS}`)
  }

  handleConnection(client: Socket) {
    this.logger(`Client "${client.id}" connected`)
  }

  handleDisconnect(client: Socket) {
    this.logger(`Client "${client.id}" disconnected`)
  }

  @SubscribeMessage('prices')
  private prices(@MessageBody() query: QueryPriceDto): void {
    if (!this.channels.length) this.emitPrices()

    this.channels.push({
      channel: `prices:${query.qty}:sources:${query.source}`,
      query
    })
  }

  private emitPrices(): void {
    this.monitorService.run(async () => {
      const pricePromises = this.channels.map(({ channel, query }) => {
        return new Promise(async resolve => {
          try {
            const { qty, source } = query
            const data = await this.pricesService.findPriceBySource(qty, source)
            this.server.emit(channel, {
              response: `Prices of ${source}`,
              data
            })
          } catch (error) {
            new Logger('WEB_SOCKET').error(error)
            this.server.emit(channel, {
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
