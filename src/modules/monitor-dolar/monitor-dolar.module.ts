import { Module } from '@nestjs/common'

import { MonitorDolarController } from './monitor-dolar.controller'
import { PricesService } from './services/prices.service'

@Module({
  controllers: [MonitorDolarController],
  providers: [PricesService]
})
export class MonitorDolarModule {}
