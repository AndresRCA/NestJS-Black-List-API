import dotenv from 'dotenv'
// at the beginning of everything, load .env
dotenv.config()

import app from './app'

// start the service
app.listen(process.env.PORT, () => {
    console.log('app listening at http://localhost:' + process.env.PORT)
})