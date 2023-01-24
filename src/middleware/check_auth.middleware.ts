import { NextFunction, Request, Response } from 'express'
import { Auth } from '../helper_classes/Auth'

/**
 * handles authentication (check if auth-token is valid)
 */
export function validate_auth_token(req: Request, res: Response, next: NextFunction) {
    if (!Auth.is_request_valid(req.headers['auth-token'])) {
        res.sendStatus(403) // invalid request
    } else {
        next() // auth-token is valid, proceed with request
    }
}