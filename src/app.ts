import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { router as black_list_routes } from "./routes/black_list.routes"
import { validate_auth_token } from './middleware/check_auth.middleware'
import { header } from 'express-validator'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setup the middleware functions
app.use(
    header('auth-token')
        .exists().withMessage('the header "auth-token" must be defined')
        .equals(process.env.AUTH_TOKEN as string).withMessage('auth-token header must be a proper value'),
    validate_auth_token
)

// setup security and access measures
app.use(helmet())
app.use(cors({ origin: '*' }))
// throttling (allow max 20 request per minute for all requests)
app.use(rateLimit({
    windowMs: 60000, // 1 minute (this is already the default value)
    max: 20, // Limit each IP to 20 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
}))

/**
 * this route can also be used to testing purposes, like middleware functions
 */
app.get('/', (req: Request, res: Response) => {
    res.send('API Version 1.0.0')
})

// setup routes that hold their respective controllers
app.use('/black_list', black_list_routes)

export default app