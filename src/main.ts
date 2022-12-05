import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'
import { DatabaseService } from '@COMMON/services/database.service'
import { SocketIoAdapter } from '@COMMON/websocket/socket-io-adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const db = new DatabaseService(configService)

  const portHTTP = Number(configService.get<string>('PORT'))
  const origin = configService.get<string>('WHITE_LIST') || '*'

  // TODO: Establecer custom cors and access_token en http y websocket
  app.enableCors({ origin })
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService, { cors: { origin } }))

  await db.connectDB()
  await app.listen(portHTTP)

  new Logger('API').log(`Server listening in port ${portHTTP}`)
}

bootstrap()
