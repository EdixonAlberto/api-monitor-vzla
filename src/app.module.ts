import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PricesModule } from '@MODULES/prices/prices.module'
import { UsersModule } from '@MODULES/users/users.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PricesModule, UsersModule],
  providers: []
})
export class AppModule {
  public static port: number

  constructor(private readonly config: ConfigService) {
    AppModule.port = Number(this.config.get<string>('PORT'))
  }
}
