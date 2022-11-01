import { Injectable } from '@nestjs/common'
import { Price, PriceModel } from '@MODULES/prices/price.model'
import { PriceDto } from '@MODULES/prices/dto'

@Injectable()
export class PricesService {
  constructor() {}

  public async findPriceBySource(qty: TQty, source: string) {
    let prices: Price[] = []
    const priceList = await PriceModel(source).find()
    const isNumber = Number.isNaN(Number(qty)) === false

    if (isNumber) {
      prices = priceList.filter((_, i) => i < qty)
    } else {
      prices = qty === 'last' ? [priceList.pop()] : priceList
    }

    return prices.map(price => new PriceDto(price))
  }
}
