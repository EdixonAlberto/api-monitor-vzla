import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { PricesService } from './services/prices.service'
import { MonitorService } from './services/monitor.service'
import { PricesController } from './prices.controller'
import { PriceGateway } from './price.gateway'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get<string>('SERVICE_URL'),
        headers: { Authorization: `Bearer ${config.get<string>('ACCESS_TOKEN')}` },
        timeout: 1000 * 60 * 3,
        maxRedirects: 5
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [PricesController],
  providers: [PricesService, MonitorService, PriceGateway]
})
export class PricesModule {}
