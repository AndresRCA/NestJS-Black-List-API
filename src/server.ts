import dotenv from 'dotenv'
import app from "./app"

dotenv.config() // load .env

app.listen(process.env.PORT, () => {
    console.log('app listening at http://localhost:' + process.env.PORT)
})