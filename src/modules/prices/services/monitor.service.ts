import { Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'

import { StateModel, State } from '@MODULES/prices/entities/state.model'

@Injectable()
export class MonitorService {
  private readonly TIME_INTERVAL: number = 1000 * 60 * 1
  private interval: NodeJS.Timer
  private logger: Logger

  constructor() {
    this.logger = new Logger('MONITOR')
  }

  public isRun(): boolean {
    const isInterval = this.interval && this.interval['_idleTimeout'] > -1
    return isInterval
  }

  public off(): void {
    if (this.isRun()) {
      clearInterval(this.interval)
      this.logger.log(`Monitor off`)
    }
  }

  public async run(callback: () => Promise<void>): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.logger.log(`Monitor running`)

        this.interval = setInterval(async () => {
          const currentTime = this.getVzlaTime()

          try {
            const { _id, updateHours, resetDate } = await StateModel.findOne()

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
                    this.logger.log(`Monitor updated: ${new Date(updateTime).toISOString()}`)
                    break
                  }
                }
              }
            } else if (currentTime >= new Date(resetDate).getTime()) {
              await this.resetHours()
            }

            resolve(true)
          } catch (error) {
            reject(error)
          }
        }, this.TIME_INTERVAL)
      })
    } catch (error) {
      this.logger.error((error as Error).message)
      clearInterval(this.interval)
      process.exit(0)
    }
  }

  public async resetHours(): Promise<void> {
    const { _id, updateHours } = (await StateModel.findOne()) || {}

    if (updateHours?.length) {
      const data: State = {
        updateHours: updateHours.map(({ hour }) => ({ hour, executed: false })),
        resetDate: this.getResetDate()
      }

      await StateModel.findByIdAndUpdate(_id, data)
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
