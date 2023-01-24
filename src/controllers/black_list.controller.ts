import { Request, Response } from "express"
import { BlackListService } from "../services/black_list.service"
import { Auth } from "../helper_classes/Auth"

const black_list = new BlackListService()

/**
 * Controller that handles responses to the black list service at /black_list route
 */
export class BlackListController {

    /**
     * POST /check_phrase method
     * @param req 
     * @param res 
     * @returns 
     */
    static check_phrase(req: Request, res: Response) {
        if (!Auth.parameter_exists(req, 'message')) {
            res.sendStatus(403) // invalid request
            return
        }
    
        let msgIsProfane: boolean = black_list.is_black_listed(req.body.message)
        if (msgIsProfane) { 
            res.json({ message: 'Your text contains a black listed word', is_black_listed: true })
        } else {
            res.json({ message: 'Your text does not contain a black listed word', is_black_listed: false })
        }
    }

    /**
     * POST /add_profanity method
     * @param req 
     * @param res 
     * @returns 
     */
    static add_profanity(req: Request, res: Response) {
        if (!Auth.parameter_exists(req, 'new_word')) {
            res.sendStatus(403) // invalid request
            return
        }
    
        let new_word: string = req.body['new_word']
        if (!black_list.is_black_listed(new_word)) { // if the new word is not profane, that means it's not on the list
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
    }
}