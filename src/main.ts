import { BlackList } from './services/black-list'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'

dotenv.config() // load .env

/*----------- Server setup -------*/
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * 
 * @param auth_token auth token used to validate a request (defined in .env)
 * @returns 
 */
function is_request_valid(auth_token: string | string[] | undefined): boolean {
    return (auth_token != undefined || auth_token === process.env.AUTH_TOKEN)
}
/*--------------------------------*/

/*------- Black list setup -------*/
const black_list = new BlackList();
/*--------------------------------*/

app.post('/check_phrase', (req, res) => {
    if (!is_request_valid(req.headers['auth-token']) || !req.body['message']) {
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
    if (!is_request_valid(req.headers['auth-token']) || !req.body['new_word']) {
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

app.listen(process.env.PORT, () => {
    console.log('app listening at http://localhost:' + process.env.PORT)
})