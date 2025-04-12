import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guards';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOwnerOrAdminGuard } from './guards/task-owner-or-admin.guard';
import { TasksService } from './tasks.service';


@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly httpService: HttpService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.tasksService.findAll(user, paginationDto);
  }

  @Post('populate')
  @UseGuards(ApiKeyGuard)
  async populateTasks() {
    const { data } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/todos')
    );

    return this.tasksService.populate(data);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.tasksService.findOne(+id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(+id, updateTaskDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(TaskOwnerOrAdminGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tasksService.remove(+id);
  }



}
