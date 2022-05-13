import { Test, TestingModule } from '@nestjs/testing'

import { MonitorDolarController } from './monitor-dolar.controller'

describe('MonitorDolarController', () => {
  let controller: MonitorDolarController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorDolarController]
    }).compile()

    controller = module.get<MonitorDolarController>(MonitorDolarController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
