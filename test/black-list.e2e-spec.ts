import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { BlackListModule } from '../src/black-list/black-list.module'
import { BlackListService } from '../src/black-list/services/black-list.service'
import { AuthKeyGuard } from '../src/guards/auth-key.guard'

describe('BlackListController (e2e)', () => {
  let app: INestApplication
  let blackListService: BlackListService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BlackListModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalGuards(new AuthKeyGuard())
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // remove any extra properties from incoming payload
        forbidNonWhitelisted: true // forbid requests with incoming payload that don't follow a scheme (dto)
      })
    )
    await app.init()

    blackListService = moduleFixture.get<BlackListService>(BlackListService)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/black-list/check-phrase/:message (GET)', () => {
    it('should return 200 status & valid response', async () => {
      jest.spyOn(blackListService, 'isBlackListed').mockImplementation(() => false)

      let res = await request(app.getHttpServer())
        .get('/black-list/check-phrase/hola!')
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(200)
        
      expect(res.body.is_black_listed).toBe(false)
    })
  })
  
  describe('/black-list/add-profanity (POST)', () => {
    test('expect 201 status & error in body when user tries to add word that is already on the list', async () => {
      jest.spyOn(blackListService, 'isBlackListed').mockImplementation(() => true)
      
      let res = await request(app.getHttpServer())
        .post('/black-list/add-profanity')
        .send({ new_word: 'mierda' })
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(201)

      expect(res.body.fulfilled).toBe(false) // a profanity could not be added, but the request was processed just fine
    })
  })
})
