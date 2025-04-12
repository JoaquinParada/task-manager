import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksEventsListener } from './listener/tasks.events.listener';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),
    HttpModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksEventsListener],
})
export class TasksModule { }
