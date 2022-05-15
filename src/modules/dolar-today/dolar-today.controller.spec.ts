import { Test, TestingModule } from '@nestjs/testing'

import { DolarTodayController } from './dolar-today.controller'

describe('DolarTodayController', () => {
  let controller: DolarTodayController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DolarTodayController]
    }).compile()

    controller = module.get<DolarTodayController>(DolarTodayController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
