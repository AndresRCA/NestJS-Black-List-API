import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    appController = app.get<AppController>(AppController);
  })

  describe('root', () => {
    it('should return message regarding version', () => {
      expect(appController.getRoot()).toBe('API Version ' + process.env.API_VERSION);
    })
  })
})