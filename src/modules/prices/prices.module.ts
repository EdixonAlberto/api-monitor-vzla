import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { PriceModel } from '@MODULES/prices/price.model'
import { PricesService } from './prices.service'
import { PricesController } from './prices.controller'

@Module({
  imports: [TypegooseModule.forFeature([PriceModel])],
  controllers: [PricesController],
  providers: [PricesService]
})
export class PricesModule {}
