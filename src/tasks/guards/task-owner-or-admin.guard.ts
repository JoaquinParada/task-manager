import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';


@Injectable()
export class TaskOwnerOrAdminGuard implements CanActivate {
    constructor(
        private readonly tasksService: TasksService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const taskId = request.params.id;

        const task = await this.tasksService.findOneRaw(taskId);

        if (!task) throw new ForbiddenException('Task not found');

        const isOwner = task.user.id === user.id;
        const isAdmin = user.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        return true;
    }
}
