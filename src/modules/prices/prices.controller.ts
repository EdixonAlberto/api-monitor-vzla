import { Controller, Get, Param } from '@nestjs/common'
import { PricesService } from './services/prices.service'
import { PriceDto, QueryPriceDto } from './dto'
import { ResponseDto } from '@COMMON/dto/response.dto'

@Controller('/api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get(':qty')
  async findPrices(@Param() { qty }: QueryPriceDto): Promise<ResponseDto<PriceDto[]>> {
    const data = await this.pricesService.findPrices(qty)

    return {
      response: 'All price sources',
      data
    }
  }

  @Get(':qty/sources/:source')
  async findPricesBySource(@Param() { qty, source }: QueryPriceDto): Promise<ResponseDto<PriceDto[]>> {
    const data = await this.pricesService.findPricesBySource(qty, source)

    return {
      response: `Prices of ${source}`,
      data
    }
  }
}
