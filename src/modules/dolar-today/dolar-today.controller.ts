import { Controller, Get } from '@nestjs/common'

@Controller('dolar-today')
export class DolarTodayController {
  constructor() {}

  @Get('/prices/current')
  public async getPrice() {
    return {}
  }
}
