import { INestApplicationContext, Logger } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { ConfigService } from '@nestjs/config'

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger('WEB_SOCKET')

  constructor(
    private readonly app: INestApplicationContext,
    private readonly config: ConfigService,
    private readonly optionsGlobal?: Partial<ServerOptions>
  ) {
    super(app)
  }

  createIOServer(port: number, options: ServerOptions) {
    const portWS = Number(this.config.get<string>('PORT_WS')) || port
    const portHTTP = this.config.get<string>('PORT')
    const optionsWS: ServerOptions = {
      ...options,
      ...this.optionsGlobal,
      path: '/socket.io'
    }

    this.logger.log(`Websocket listening in port ${portWS || portHTTP}`)
    return super.createIOServer(portWS, optionsWS)
  }
}
