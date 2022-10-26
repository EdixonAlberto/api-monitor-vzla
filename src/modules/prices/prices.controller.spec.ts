import { Test, TestingModule } from '@nestjs/testing'
import { PricesController } from './prices.controller'
import { PricesService } from './prices.service'

describe('PricesController', () => {
  let controller: PricesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricesController],
      providers: [PricesService]
    }).compile()

    controller = module.get<PricesController>(PricesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
