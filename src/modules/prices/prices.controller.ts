import { Controller, Get, Param } from '@nestjs/common'
import { PricesService } from './prices.service'
import { PriceDto, QueryPriceDto } from './dto'
import { ResponseDto } from '@COMMON/dto/response.dto'

@Controller('/api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get(':qty/source/:source')
  async findPriceBySource(@Param() { qty, source }: QueryPriceDto): Promise<ResponseDto<PriceDto[]>> {
    const data = await this.pricesService.findPriceBySource(qty, source)

    return {
      response: `Prices of ${source}`,
      data
    }
  }
}
