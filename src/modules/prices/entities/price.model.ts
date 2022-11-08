import { getModelForClass, modelOptions, prop, Severity, mongoose } from '@typegoose/typegoose'
import { Source } from './source.model'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class Price {
  readonly _id?: mongoose.Types.ObjectId

  @prop({ required: true, ref: Source, type: mongoose.Types.ObjectId })
  readonly sourceId: mongoose.Types.ObjectId & Source

  @prop({ required: true })
  readonly currencies: TCurrency[]

  @prop({ required: true })
  readonly timestamp: Date

  readonly createdAt?: Date
}

export const PriceModel = (modelName: string) => {
  return getModelForClass(Price, {
    options: {
      customName: modelName,
      allowMixed: Severity.ALLOW
    },
    schemaOptions: {
      versionKey: false
    }
  })
}
