import { Test, TestingModule } from '@nestjs/testing'
import { BlackListController } from './black-list.controller'
import { BlackListModule } from './black-list.module'

describe('BlackListController', () => {
  let controller: BlackListController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlackListModule]
    }).compile()

    controller = module.get<BlackListController>(BlackListController);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})