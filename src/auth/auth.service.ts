import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { envs } from 'src/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthPayloadDto } from './dto/auth.dto';


@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) { }

    async validateUser({ username, password }: AuthPayloadDto) {
        const findUser = await this.userRepository.findOneBy([{ username }, { password }])
        if (!findUser) return null;

        return this.generateTokens(findUser);
    }

    generateTokens(user: User) {
        const payload = { username: user.username, id: user.id, role: user.role };

        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: envs.refreshTokenSecret,
        });

        return { access_token, refresh_token };
    }

    refreshAccessToken(user: any) {
        return {
            access_token: this.jwtService.sign(
                { username: user.username, sub: user.sub },
                { expiresIn: '15m' }
            )
        };
    }
}
