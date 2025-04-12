import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async postUser(dto: CreateUserDto) {
        const data = this.userRepository.create({ ...dto });
        await this.userRepository.save(data
        )
        return data

    }

    async findAll() {
        const users = await this.userRepository.findAndCount();
        return users
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = this.userRepository.findOneBy({ username })
        return user;
    }

    async findOneById(id: number) {
        const user = this.userRepository.findOneBy({ id })
        return user;
    }
}
