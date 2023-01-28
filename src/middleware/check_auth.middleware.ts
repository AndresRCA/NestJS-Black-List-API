import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

/**
 * Check header 'auth-token' for validation
 * @param req should hold the header "auth-token" used to validate a request (defined in .env)
 * @param res server response
 * @param next express next function for middlewares
 */
export function validate_auth_token(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array() }) // invalid body
    else next() // auth-token is valid, proceed with request
}