import { Controller, Get, Query, Param } from '@nestjs/common'

@Controller('monitor-dolar')
export class MonitorDolarController {
  constructor() {}

  @Get('/prices/current')
  public async getPrices() {
    return {}
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
