import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Roles as RolesEnum } from "src/common/enums/role.enums";
import { RolesGuard } from 'src/common/guards/role.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    postUser(@Body() dto: CreateUserDto) {
        return this.userService.postUser(dto)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getOneUser(@Param('id') id: ParseIntPipe) {
        return this.userService.findOneById(+id)
    }

    @Get()
    @Roles(RolesEnum.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.userService.findAll()
    }


}
