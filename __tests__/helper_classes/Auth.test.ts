import { Auth } from '../../src/helper_classes/Auth'

describe('is_request_valid', () => {
    it('should not take an invalid token value', () => {
        expect(Auth.is_request_valid('invalid token')).toBe(false)
    })
})