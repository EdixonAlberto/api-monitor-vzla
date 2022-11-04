import { Module } from '@nestjs/common'
import { PricesService } from './services/prices.service'
import { MonitorService } from './services/monitor.service'
import { PricesController } from './prices.controller'
import { PriceGateway } from './price.gateway'

@Module({
  controllers: [PricesController],
  providers: [PricesService, MonitorService, PriceGateway]
})
export class PricesModule {}
