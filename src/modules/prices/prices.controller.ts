import { Controller, Get } from '@nestjs/common'
import { PricesService } from './prices.service'

@Controller('/api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('last/source/:source')
  async findPriceBySource() {
    const data = await this.pricesService.findPriceBySource()
    return data
  }
}
