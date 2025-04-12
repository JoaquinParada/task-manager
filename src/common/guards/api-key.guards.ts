import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { envs } from 'src/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['api-key'];

        if (apiKey !== envs.apiKey) {
            throw new UnauthorizedException('Invalid API key');
        }
        return true;
    }
}