import { Test, TestingModule } from '@nestjs/testing'
import { BlackListService } from './black-list.service'
import { BlackListModule } from '../black-list.module'

describe('BlackListService', () => {
  let service: BlackListService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlackListModule]
    }).compile()

    service = module.get<BlackListService>(BlackListService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('addNewProfanity', () => {
    it('should add new word to the black list', () => {
      service.addNewProfanity('hola')
    })
  })
})
