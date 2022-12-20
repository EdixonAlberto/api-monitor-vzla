import { Injectable } from '@nestjs/common'

import { PriceDto } from '@MODULES/prices/dto'
import { Price, PriceModel } from '@MODULES/prices/entities/price.model'

@Injectable()
export class PricesService {
  constructor() {}

  public async findPricesBySource(qty: TQty, source: string) {
    let prices: Price[] = []
    const isNumber = Number.isNaN(Number(qty)) === false

    const priceList = await PriceModel(source).find().populate('sourceId', { key: 0, urlList: 0 })
    if (!priceList.length) return []

    if (isNumber) {
      prices = priceList.reverse().filter((_, i) => i < qty)
    } else {
      prices = qty === 'last' ? [priceList.pop()] : priceList.reverse()
    }

    return prices.map(price => new PriceDto(price))
  }

  public async findPrices(qty: TQty, sourceList: string[]) {
    let queryPromiseList: Array<Promise<Price[]>> = []
    let pricesList: Array<Price[]> = []

    for (const sourceName of sourceList) {
      queryPromiseList.push(
        PriceModel(sourceName).find().populate('sourceId', { key: 0, urlList: 0 }) as unknown as Promise<Price[]>
      )
    }

    const resultPriceList = await Promise.allSettled(queryPromiseList)

    for (const resultPrice of resultPriceList) {
      if (resultPrice.status === 'fulfilled' && resultPrice.value.length) {
        const prices = qty === 'last' ? [resultPrice.value.pop()] : resultPrice.value.filter((_, i) => i < qty)
        pricesList.push(prices)
      }
    }
    if (!pricesList.length) return []

    // TODO: Cambiar esta parte del codigo para retornar un array de array de precios
    // y el flat dejarlo para cuando "qty" se "last"
    const prices = pricesList.flat()
    return prices.map(price => new PriceDto(price))
  }
}
