import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PricesModule } from '@MODULES/prices/prices.module'
import { UsersModule } from '@MODULES/users/users.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PricesModule, UsersModule],
  providers: []
})
export class AppModule {
  constructor() {}
}
