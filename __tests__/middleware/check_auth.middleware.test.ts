import app from "../../src/app"
import request from 'supertest'

describe('check_auth.middleware test', () => {
    it('should not accept an empty header', async () => {
        let res = await request(app)
            .get('/')
            .expect(403)

        expect(res.body.errors).toBeDefined()
    })

    it('should not accept an invalid token value', async () => {
        let res = await request(app)
            .get('/')
            .set('auth-token', 'invalid token')
            .expect(403)

        expect(res.body.errors).toBeDefined()
    })

    it('should accept a valid token value', async () => {
        let res = await request(app)
            .get('/')
            .set('auth-token', process.env.AUTH_TOKEN as string)
            .expect(200)

        expect(res.body.errors).toBeUndefined()
    })
})