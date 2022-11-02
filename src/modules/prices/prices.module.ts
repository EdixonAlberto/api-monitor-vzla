import { Module } from '@nestjs/common'
import { PricesService } from './services/prices.service'
import { PricesController } from './prices.controller'

@Module({
  controllers: [PricesController],
  providers: [PricesService]
})
export class PricesModule {}
