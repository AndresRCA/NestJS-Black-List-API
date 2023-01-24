import request from "supertest"
import app from "../src/app"

describe('POST /check_phrase', () => {
    it('should return 200 status & valid response', async () => {
        let res = await request(app)
            .post('/check_phrase')
            .send({ message: 'hola!' })
            .set('auth-token', process.env.AUTH_TOKEN as string)
            .expect(200)

        // if expect(200) had no problems, now check the response body parameters
        expect(res.body.is_black_listed).toBe(false)
    })
})

describe('POST /add_profanity', () => {
    test('expect 200 status & return res.body.status = "INVALID" when user tries to add word that is already on the list', async () => {
        let res = await request(app)
            .post('/add_profanity')
            .send({ new_word: 'mierda' })
            .set('auth-token', process.env.AUTH_TOKEN as string)
            .expect(200)

        // if expect(200) had no problems, now check the response body parameters
        expect(res.body.status).toBe('INVALID')
    })
})