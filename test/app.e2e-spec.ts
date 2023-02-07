import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'
import { AuthKeyGuard } from '../src/guards/auth-key.guard'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalGuards(new AuthKeyGuard())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/ (GET)', () => {
    it('should return status 403 when X-Auth-Header is not valid', async () => {
      await request(app.getHttpServer())
        .get('/')
        .set('X-Auth-Key', 'invalid key')
        .expect(403)
    })
  })
})