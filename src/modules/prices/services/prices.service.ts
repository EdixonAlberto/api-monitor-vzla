import { Injectable } from '@nestjs/common'
import { PriceDto } from '@MODULES/prices/dto'
import { Price, PriceModel } from '@MODULES/prices/entities/price.model'
import { SourceModel } from '@SRC/modules/prices/entities/source.model'

@Injectable()
export class PricesService {
  constructor() {}

  public async findPricesBySource(qty: TQty, source: string) {
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

  public async findPrices(qty: TQty) {
    const sources = await SourceModel.find()
    const sourceNameList = sources.map(source => source.key.toLowerCase())
    let queryPromiseList: Array<Promise<Price[]>> = []
    let pricesList: Array<Price[]> = []

    for (const sourceName of sourceNameList) {
      queryPromiseList.push(
        PriceModel(sourceName).find().populate('sourceId', { key: 0, urlList: 0 }) as unknown as Promise<Price[]>
      )
    }

    const resultPriceList = await Promise.allSettled(queryPromiseList)

    for (const resultPrice of resultPriceList) {
      if (resultPrice.status === 'fulfilled') {
        const prices = qty === 'last' ? [resultPrice.value.pop()] : resultPrice.value.filter((_, i) => i < qty)
        pricesList.push(prices)
      }
    }

    const prices = pricesList.flat()
    return prices.map(price => new PriceDto(price))
  }
}
