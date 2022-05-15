import { Injectable, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { resolve } from 'path'
import { ocrSpace } from 'ocr-space-api-wrapper'

@Injectable()
export class PricesService {
  constructor(private readonly config: ConfigService) {}

  public async getCurrent() {
    try {
      const imgPath = resolve('images', 'example1.jpg')
      const response: OCRSpaceResponse = await ocrSpace(imgPath, {
        apikey: this.config.get<string>('API_KEY_OCR_SPACE')
      })

      return {
        status: HttpStatus.OK,
        price: response
      }
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
      }
    }
  }
}
