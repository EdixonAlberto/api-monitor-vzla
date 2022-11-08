import { Injectable } from '@nestjs/common'
import { Price, PriceModel } from '@MODULES/prices/entities/price.model'
import { PriceDto } from '@MODULES/prices/dto'

@Injectable()
export class PricesService {
  constructor() {}

  public async findPriceBySource(qty: TQty, source: string) {
    let prices: Price[] = []
    const priceList = await PriceModel(source).find().populate('sourceId', { key: 0, urlList: 0 })
    const isNumber = Number.isNaN(Number(qty)) === false

    if (isNumber) {
      prices = priceList.reverse().filter((_, i) => i < qty)
    } else {
      prices = qty === 'last' ? [priceList.pop()] : priceList.reverse()
    }

    return prices.map(price => new PriceDto(price))
  }
}
