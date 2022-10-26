import { DynamicModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypegooseModule, TypegooseModuleOptions } from 'nestjs-typegoose'

export const DatabaseProvider: DynamicModule = TypegooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory(config: ConfigService): TypegooseModuleOptions {
    return {
      uri: config.get<string>('MONGO_URI'),
      useNewUrlParser: true
    }
  }
})
