import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { DatabaseService } from '@COMMON/services/database.service'
import { SocketIoAdapter } from '@COMMON/websocket/socket-io-adapter'

async function bootstrap() {
  const db = new DatabaseService()
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const origin = configService.get<string>('WHITE_LIST').split(',')

  // app.enableCors({
  //   origin,
  //   credentials: true
  // })
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService, { cors: { origin } }))

  await db.connectDB()
  await app.listen(AppModule.portHTTP)

  new Logger('API').log(`Server listening in port ${AppModule.portHTTP}`)
}

bootstrap()
