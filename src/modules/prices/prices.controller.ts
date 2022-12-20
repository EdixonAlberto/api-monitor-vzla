import { Controller, Get, Post, Param, Body } from '@nestjs/common'

import { PricesService } from './services/prices.service'
import { PriceDto, QueryPriceDto } from './dto'
import { ResponseDto } from '@COMMON/dto/response.dto'
import { PriceGateway } from './price.gateway'

@Controller('/api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService, private readonly pricesGateway: PriceGateway) {}

  // TODO: Pensar si se puede enviar los datos por "queryParams" para usar un metodo "Get"
  @Post(':qty')
  async findPrices(@Param() { qty }: QueryPriceDto, @Body() sourceList: string[]): Promise<ResponseDto<PriceDto[]>> {
    const data = await this.pricesService.findPrices(qty, sourceList)

    return {
      response: 'All price sources',
      data
    }
  }

  @Get('/emit/sources/:source')
  async emitPricesBySource(@Param() { source }: QueryPriceDto): Promise<ResponseDto<PriceDto[]>> {
    const data = await this.pricesService.findPricesBySource('last', source)
    const { server } = this.pricesGateway
    const event = `prices:last:sources:`

    server.emit(event, {
      responde: `Prices of ${source}`,
      data
    })

    return {
      response: `Price of source '${source}' emited`,
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
