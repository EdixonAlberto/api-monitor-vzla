import { modelOptions, prop, Severity } from '@typegoose/typegoose'
// import { ObjectId } from 'mongoose' //TODO:

@modelOptions({
  options: {
    customName: 'dolartoday',
    allowMixed: Severity.ALLOW
  },
  schemaOptions: {
    versionKey: false
  }
})
export class PriceModel {
  _id: string

  @prop({ required: true })
  currencies: TCurrencie[]

  @prop({ required: true })
  timestamp: Date

  @prop({ required: true })
  createdAt: Date
}
