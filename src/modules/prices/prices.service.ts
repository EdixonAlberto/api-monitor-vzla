import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { PriceModel } from '@MODULES/prices/price.model'

@Injectable()
export class PricesService {
  constructor(@InjectModel(PriceModel) private readonly priceModel: ReturnModelType<typeof PriceModel>) {}

  public async findPriceBySource() {
    const prices = await this.priceModel.find()
    return prices.pop()
  }
}
