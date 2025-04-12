import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Task } from '../entities/task.entity';


@Injectable()
export class TasksEventsListener {
    private readonly logger = new Logger('TasksEvents');

    @OnEvent('task.created')
    handleTaskCreated(task: Task) {
        this.logger.log(`Tarea creada: ${task.title} (ID: ${task.id})`);
    }

    @OnEvent('task.completed')
    handleTaskCompleted(task: Task) {
        this.logger.log(`Tarea completada: ${task.title} (ID: ${task.id})`);
    }
}