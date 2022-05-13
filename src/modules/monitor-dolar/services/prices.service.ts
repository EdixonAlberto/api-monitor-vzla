import { Injectable, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Instagrapi } from 'instagrapi'

@Injectable()
export class PricesService {
  private readonly usernameIG: string = 'enparaleloenvzla'
  private readonly instagrapi: Instagrapi

  constructor(private readonly config: ConfigService) {
    this.instagrapi = new Instagrapi({
      sessionId: this.config.get<string>('SESSION_ID')
    })
  }

  public async getCurrent() {
    let postUrl = '',
      monitorData = ''

    try {
      const lastPosts = await this.instagrapi.getLastPosts(this.usernameIG)

      for (let i = 0; i < lastPosts.length; i++) {
        const post = lastPosts[i]

        if (!monitorData) {
          const content = post.content

          if (content) {
            const start = content.search(/🗓️/)

            if (start > -1) {
              postUrl = post.postUrl
              const end = content.search(/\n(@|#)/)
              monitorData = content.substring(start, end).trim()
            }
          }
        } else break
      }

      return {
        status: HttpStatus.OK,
        price: this.formatPrice(monitorData, postUrl)
      }
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: (error as Error).message
      }
    }
  }

  private formatPrice(rawData: string, source: string): TPrice {
    const data = rawData.split(' ').map(item => item.trim())

    const timeList = data[3].split(':')
    const time = `${Number(timeList[0]) + 12}:${timeList[1]}:00.000Z`
    const date = data[1].split('/').reverse().join('-')
    const timestamp = new Date(`${date}T${time}`)

    const price = <TPrice>{
      amount: parseFloat(data[7].replace(',', '.')),
      chg: {
        amount: parseFloat(data[11].replace(',', '.')),
        percentage: data[9],
        trend: data[8] === '🔻' ? 'down' : data[8] === '🔺' ? 'up' : 'like'
      },
      source,
      timestamp
    }

    return price
  }
}
