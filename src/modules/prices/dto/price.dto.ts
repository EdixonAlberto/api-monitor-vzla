import { mongoose } from '@typegoose/typegoose'
import { Price } from '@MODULES/prices/entities/price.model'

class SourceData {
  readonly id: string
  readonly name: string
  readonly logo: string
  readonly urlPublic: string
  readonly type: 'fiat' | 'crypto'
  readonly country: string
  readonly symbol: string
  readonly enabled: boolean
}

export class PriceDto {
  readonly id: mongoose.Types.ObjectId
  readonly source: SourceData
  readonly currencies: TCurrency[]
  readonly timestamp: Date
  readonly createAt: Date

  constructor(price: Price) {
    const { sourceId: sourceData } = price

    this.id = price._id
    this.source = {
      id: sourceData._id.toString(),
      name: sourceData.name,
      logo: sourceData.logo,
      urlPublic: sourceData.urlPublic,
      type: sourceData.type,
      country: sourceData.country,
      symbol: sourceData.symbol,
      enabled: sourceData.enabled
    }
    this.currencies = price.currencies
    this.timestamp = price.timestamp
    this.createAt = price.createdAt
  }
}
