import dotenv from 'dotenv'
import app from './app'

// load .env
dotenv.config()

// start the service
app.listen(process.env.PORT, () => {
    console.log('app listening at http://localhost:' + process.env.PORT)
})