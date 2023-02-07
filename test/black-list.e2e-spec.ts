import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { BlackListModule } from '../src/black-list/black-list.module'

describe('BlackListController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BlackListModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // remove any extra properties from incoming payload
        forbidNonWhitelisted: true // forbid requests with incoming payload that don't follow a scheme (dto)
      })
    )
    await app.init()
  })

  describe('/black-list/check-phrase (POST)', () => {
    it('should return 200 status & valid response', async () => {
      let res = await request(app.getHttpServer())
        .post('/black-list/check-phrase')
        .send({ message: 'hola!' })
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(200)

      // if expect(200) had no problems, now check the response body parameters
      expect(res.body.is_black_listed).toBe(false)
    })

    it('should not accept invalid post body', async () => {
      await request(app.getHttpServer())
        .post('/black-list/check-phrase')
        .send({ invalid_parameter_name: 'hola!' })
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(400)
    })

    it('should not accept a null value in post body', async () => {
      await request(app.getHttpServer())
        .post('/black-list/check-phrase')
        .send({ message: null })
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(400)
    })
  })
  
  describe('/black-list/add-profanity (POST)', () => {
    test('expect 201 status & error in body when user tries to add word that is already on the list', async () => {
      let res = await request(app.getHttpServer())
        .post('/black-list/add-profanity')
        .send({ new_word: 'mierda' })
        .set('X-Auth-Key', process.env.AUTH_KEY as string)
        .expect(201)

      // if expect(200) had no problems, now check the response body parameters
      expect(res.body.error).toBeDefined() // error here is defined when a profanity could not be added, but the request was processed just fine
    })
  })
})
