import { getModelForClass, modelOptions, prop, Severity, mongoose } from '@typegoose/typegoose'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class Price {
  readonly _id: mongoose.ObjectId

  @prop({ required: true })
  readonly currencies: TCurrencie[]

  @prop({ required: true })
  readonly timestamp: Date

  @prop({ required: true })
  readonly createdAt: Date
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
