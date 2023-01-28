import express from 'express'
import bodyParser from 'body-parser'
import { router as black_list_routes } from "./routes/black_list.routes"
import { validate_auth_token } from './middleware/check_auth.middleware'
import helmet from 'helmet'
import cors from 'cors'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setup the middleware functions
app.use(validate_auth_token)

// setup security and access measures
app.use(helmet())
app.use(cors({ origin: '*' }))

// setup routes that hold their respective controllers
app.use('/black_list', black_list_routes)

export default app