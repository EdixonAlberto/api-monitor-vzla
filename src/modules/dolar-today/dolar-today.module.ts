import { Module } from '@nestjs/common'

import { DolarTodayController } from './dolar-today.controller'
import { PricesService } from './services/prices.service'

@Module({
  controllers: [DolarTodayController],
  providers: [PricesService]
})
export class DolarTodayModule {}
