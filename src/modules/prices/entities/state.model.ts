import { getModelForClass, modelOptions, prop, Severity, mongoose } from '@typegoose/typegoose'
import { DatabaseService } from '@COMMON/services/database.service'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class State {
  readonly _id?: mongoose.Types.ObjectId

  @prop({ required: true })
  readonly scope: 'API' | 'SERVICE'

  @prop({ required: true })
  readonly updateHours: Array<{
    hour: string
    executed: boolean
  }>

  @prop({ required: true })
  readonly resetDate: Date
}

export const StateModel = getModelForClass(State, {
  ...DatabaseService.defaultOptionsModel('state')
})
