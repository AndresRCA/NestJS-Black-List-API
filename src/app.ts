import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { router as black_list_routes } from './routes/black_list.routes'
import { request_logger } from './middleware/logger.middleware'
import { validate_auth_token } from './middleware/check_auth.middleware'
import { header } from 'express-validator'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const app = express()
// disable header that indicates the server is running on Express
app.disable('x-powered-by')

// setup the middleware functions
// request logger
app.use(request_logger())
// json body parser for POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// token validation
app.use(
    header('auth-token')
        .exists().withMessage('the header "auth-token" must be defined')
        .equals(process.env.AUTH_TOKEN as string).withMessage('auth-token header must have a proper value'),
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
 * this route can also be used for testing purposes, like against middleware functions
 */
app.get('/', (req: Request, res: Response) => {
    res.send('API Version 1.0.0')
})

// setup routes that hold their respective controllers
app.use('/black_list', black_list_routes)

export default app