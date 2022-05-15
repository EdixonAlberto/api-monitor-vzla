import { Controller, Get } from '@nestjs/common'

import { PricesService } from './services/prices.service'

@Controller('dolar-today')
export class DolarTodayController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('/prices/current')
  public async getPrice() {
    return this.pricesService.getCurrent()
  }
}
