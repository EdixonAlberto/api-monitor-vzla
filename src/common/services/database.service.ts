import { mongoose, types, Severity } from '@typegoose/typegoose'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

export class DatabaseService {
  constructor(private readonly config: ConfigService) {}

  public async connectDB(): Promise<void> {
    try {
      const mongodbURI = this.config.get<string>('MONGO_URI')
      const db = await mongoose.connect(mongodbURI)
      new Logger('DB').log(`Database connected: ${db.connection.name}`)
    } catch (error) {
      new Logger('DB').error((error as Error).message)
      process.exit(0)
    }
  }

  public static defaultOptionsModel(customName: string): types.IModelOptions {
    return {
      options: {
        customName,
        allowMixed: Severity.ALLOW
      },
      schemaOptions: {
        versionKey: false,
        timestamps: {
          createdAt: false,
          updatedAt: false
        }
      }
    }
  }
}
