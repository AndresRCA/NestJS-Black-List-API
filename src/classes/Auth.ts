import { Request } from "express"

/**
 * Helper class for auth methods
 */
export class Auth {

    constructor() {}

    /**
     * Check header 'auth-token' for validation
     * @param auth_token auth token used to validate a request (defined in .env)
     * @returns false if passed value is not valid
     */
    static is_request_valid(auth_token: string | string[] | undefined): boolean {
        return (auth_token !== undefined && auth_token === process.env.AUTH_TOKEN)
    }

    /**
     * Checks whether parameter exists or has a value
     * @param req request from client
     * @param parameter_name name of parameter that should be in req.body
     * @returns whether parameter exists or has a value
     */
    static parameter_exists(req: Request, parameter_name: string): boolean {
        return !(req.body[parameter_name] === undefined || req.body[parameter_name] === null)
    }
}