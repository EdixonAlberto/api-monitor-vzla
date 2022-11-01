import { mongoose } from '@typegoose/typegoose'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

export class DatabaseService {
  constructor(private readonly config = new ConfigService()) {}

  public async connectDB(): Promise<void> {
    try {
      const mongodbURI = this.config.get<string>('MONGO_URI')
      const db = await mongoose.connect(mongodbURI)
      new Logger('DB').log(`Database connected: ${db.connection.name}`)
    } catch (error) {
      new Logger('DB').error((error as Error).message)
      throw null
    }
  }
}
