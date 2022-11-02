import { StateModel, State } from '@MODULES/prices/entities/state.model'
import { Logger } from '@nestjs/common'

export class Monitor {
  private TIME_INTERVAL: number
  private interval: NodeJS.Timer
  private readonly UPDATE_HOURS: string[] = ['09:32', '13:32']

  constructor() {
    this.TIME_INTERVAL = 1000 * 60 * 1
    this.interval = setInterval(() => null)
  }

  public async run(callback: () => Promise<void>): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.interval = setInterval(async () => {
          const currentTime = this.getVzlaTime()

          try {
            const { _id, updateHours, resetDate } = (await StateModel.find())[0]

            if (this.someUpdateWithoutExecute(updateHours)) {
              for (let i = 0; i < updateHours.length; i++) {
                const { hour, executed } = updateHours[i]

                if (!executed) {
                  // Obtener la fecha actual a partir del tiempo de Vzla para formatear las horas de actualización
                  const partialDate = new Date(currentTime).toISOString().split('T')[0]
                  const updateTime = new Date(`${partialDate}T${hour}:00.000Z`).getTime()

                  if (currentTime >= updateTime) {
                    // Recordar que se ejecutó el callback en esta fecha
                    updateHours.forEach(updateHour => {
                      if (updateHour.hour === hour) updateHour.executed = true
                    })
                    await StateModel.findByIdAndUpdate(_id, { updateHours })

                    await callback()
                    new Logger('MONITOR').log(`Update: ${new Date(updateTime).toISOString()}`)
                    break
                  }
                }
              }
            } else if (currentTime >= new Date(resetDate).getTime()) {
              await this.loadUpdateHours(true)
              new Logger('MONITOR').log(`Reset: ${resetDate.toISOString()}`)
            }

            resolve(true)
          } catch (error) {
            new Logger('MONITOR').error(`ERROR: ${(error as Error).message}`)
            reject(error)
          }
        }, this.TIME_INTERVAL)
      })
    } catch (error) {
      clearInterval(this.interval)
      throw error
    }
  }

  public async loadUpdateHours(isReset: boolean = false): Promise<void> {
    const { updateHours } = (await StateModel.find({ scope: 'API' }))[0] || {}

    if (!updateHours?.length || isReset) {
      const data: State = {
        scope: 'API',
        updateHours: this.UPDATE_HOURS.map(hour => ({ hour, executed: false })),
        resetDate: this.getResetDate()
      }

      if (isReset) await StateModel.updateMany(data)
      else await new StateModel(data).save()
    }
  }

  private getVzlaTime(): number {
    const time = new Date().getTime()
    // restar 4 hrs para adecuar el timezone a Venezuela
    return time - 14400000
  }

  private getResetDate(): Date {
    const date = new Date()
    const partialDate = date.toISOString().split('T')[0]
    const resetDate = new Date(`${partialDate}T00:00:00.000Z`)
    const time = resetDate.getTime()
    // Sumar 24 hrs para obtener el tiempo restante para que se termine el día
    const resetTime = time + 86400000
    return new Date(resetTime)
  }

  private someUpdateWithoutExecute(updateHours: any[]): boolean {
    return updateHours.some(({ executed }) => !executed)
  }
}
