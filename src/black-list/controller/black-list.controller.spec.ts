import { Test, TestingModule } from '@nestjs/testing'
import { Response } from 'express'
import { BlackListController } from './black-list.controller'
import { BlackListModule } from '../black-list.module'
import { BlackListService } from '../services/black-list.service'

describe('BlackListController', () => {
  let controller: BlackListController
  let blackListService: BlackListService
  
  /*-------------- mock objects -------------*/
  // (use when your handler has @Res as a parameter)
  let statusResponseMock = {}
  let responseMock = {} as unknown as Response
  /*-----------------------------------------*/

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlackListModule]
    }).compile()

    controller = module.get<BlackListController>(BlackListController)
    blackListService = module.get<BlackListService>(BlackListService)

    // reset mock objects
    statusResponseMock = {
      send: jest.fn(x => x),
      json: jest.fn(x => x)
    }
    responseMock = {
      status: jest.fn(x => statusResponseMock),
      send: jest.fn(x => x),
      json: jest.fn(x => x)
    } as unknown as Response
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('checkPhrase', () => {
    it('should return { is_black_listed: false }', async () => {
      jest.spyOn(blackListService, 'isBlackListed').mockImplementation(() => false)

      let res = await controller.checkPhrase('hola!')
      expect(res.is_black_listed).toBe(false)
    })
  })
  
  describe('addProfanity', () => {
    it('should add new word to black list', async () => {
      jest.spyOn(blackListService, 'isBlackListed').mockImplementation(() => false)
      jest.spyOn(blackListService, 'addNewProfanity').mockImplementation(async () => `word "hola" was added successfully`)

      let res = await controller.addProfanity({ new_word: 'hola' })
      expect(res.fulfilled).toBe(true)
    })

    it('should expect word that is already on the list', async () => {
      jest.spyOn(blackListService, 'isBlackListed').mockImplementation(() => true)

      let res = await controller.addProfanity({ new_word: 'mierda' })
      expect(res.fulfilled).toBe(false)
    })
  })
})