import { getModelForClass, modelOptions, prop, Severity, mongoose } from '@typegoose/typegoose'
import { DatabaseService } from '@COMMON/services/database.service'

@modelOptions({
  options: {
    customName: 'source',
    allowMixed: Severity.ALLOW
  }
})
export class Source {
  readonly _id?: mongoose.Types.ObjectId

  @prop({ required: true })
  readonly key: 'DolarToday' | 'Airtm' | 'Bcv' | 'DolarBitcoin'

  @prop({ required: true })
  readonly name: string

  @prop({ required: true })
  readonly logo: string

  @prop({ required: true })
  readonly urlPublic: string

  @prop({ required: true })
  readonly urlList: string[]

  @prop({ required: true })
  readonly type: 'fiat' | 'crypto'

  @prop({ required: true })
  readonly country: string

  @prop({ required: true })
  readonly symbol: string

  @prop({ required: true })
  readonly enabled: boolean
}

export const SourceModel = getModelForClass(Source, {
  ...DatabaseService.defaultOptionsModel('source')
})
