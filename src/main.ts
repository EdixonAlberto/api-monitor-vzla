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
  const whiteList = configService.get<string>('WHITE_LIST')
  const origin = whiteList ? whiteList.split(',') : []

  // TODO: Establecer cors en api
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
