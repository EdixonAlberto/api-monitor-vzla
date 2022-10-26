import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(AppModule.port)

  new Logger('NestApplication').log(`Server listening in port ${AppModule.port}`)
}
bootstrap()
