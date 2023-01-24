import { BlackList } from './services/black-list'
import express from 'express'
import bodyParser from 'body-parser'
import { Auth } from './classes/Auth'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/*------- Black list setup -------*/
const black_list = new BlackList()
/*--------------------------------*/

/*----------- Middleware setup -------*/
/**
 * handles authentication (check if auth-token is valid)
 */
app.use((req, res, next) => {
    if (!Auth.is_request_valid(req.headers['auth-token'])) {
        res.sendStatus(403) // invalid request
    } else {
        next() // auth-token is valid, proceed with request
    }
})
/*------------------------------------*/

app.post('/check_phrase', (req, res) => {
    if (!Auth.parameter_exists(req, 'message')) {
        res.sendStatus(403) // invalid request
        return
    }

    let msgIsProfane: boolean = black_list.filter.isProfane(req.body.message)
    if (msgIsProfane) { 
        res.json({ message: 'Your text contains a black listed word', is_black_listed: true })
    } else {
        res.json({ message: 'Your text does not contain a black listed word', is_black_listed: false })
    }
})

app.post('/add_profanity', (req, res) => {
    if (!Auth.parameter_exists(req, 'new_word')) {
        res.sendStatus(403) // invalid request
        return
    }

    let new_word: string = req.body['new_word']
    if (!black_list.filter.isProfane(new_word)) { // if the new word is not profane, that means it's not on the list
        black_list.add_new_profanity(new_word)
            .then((success_msg: string) => {
                res.json({ status: 'OK', message: success_msg })
            })
            .catch((e) => {
                console.log(e)
                res.json({ status: 'INVALID', message: 'There was a problem adding your word to our black list' })
            })
    } else {
        res.json({ status: 'INVALID', message: 'That word is already in the black list' })
    }
})

export default app