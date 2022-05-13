import { Controller, Get, Query, Param } from '@nestjs/common'

import { PricesService } from './services/prices.service'

@Controller('monitor-dolar')
export class MonitorDolarController {
  constructor(private readonly pricesServices: PricesService) {}

  @Get('/prices/current')
  public async getPrices() {
    return this.pricesServices.getCurrent()
  }

  @Get('/prices')
  public async getPricesFilter(@Query() filter: object) {
    console.log('get prices filter')
  }

  @Get('/prices/:id')
  public async getPricesById(@Param('id') id: string) {
    console.log('get prices id')
  }
}
