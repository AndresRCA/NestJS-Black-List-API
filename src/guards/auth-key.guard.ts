import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    // check if header exists and value is valid
    return (req.headers['x-auth-key'] !== undefined && req.headers['x-auth-key'] === process.env.AUTH_KEY) // reminder that headers come in lowercase
  }
}