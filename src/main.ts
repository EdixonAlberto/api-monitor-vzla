import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DatabaseService } from '@COMMON/services/database.service'

async function bootstrap() {
  const db = new DatabaseService()
  const app = await NestFactory.create(AppModule)

  await db.connectDB()
  await app.listen(AppModule.portHTTP)

  new Logger('API').log(`Server listening in port ${AppModule.portHTTP}`)
}

bootstrap()
