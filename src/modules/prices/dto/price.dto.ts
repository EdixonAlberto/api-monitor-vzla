import { mongoose } from '@typegoose/typegoose'
import { Price } from '@MODULES/prices/entities/price.model'

export class PriceDto {
  readonly id: mongoose.ObjectId

  readonly currencies: TCurrencie[]

  readonly timestamp: Date

  readonly createAt: Date

  constructor(price: Price) {
    this.id = price._id
    this.currencies = price.currencies
    this.timestamp = price.timestamp
    this.createAt = price.createdAt
  }
}
