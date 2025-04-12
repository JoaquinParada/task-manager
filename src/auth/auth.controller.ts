import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { AuthRequest } from './interfaces/auth-request.interface';
import { JwtAuthGuard } from './strategies/jwt.guard';
import { RefreshTokenGuard } from './strategies/refreshToken.guard';


@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseGuards(LocalGuard)
    login(@Req() req: AuthRequest) {
        return req.user
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    refresh(@Req() req: AuthRequest) {
        return this.authService.refreshAccessToken(req.user)
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: AuthRequest) {
        return req.user
    }
}
