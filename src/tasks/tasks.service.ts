import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { transformBoolean } from 'src/common/utils';
import { User } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) { }

  async create(createTaskDto: CreateTaskDto, user: User) {


    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });
    this.eventEmitter.emit('task.created', task);
    return this.taskRepository.save(task);
  }

  async findAll(user: User, paginationDto: PaginationDto) {


    const { limit = 50, offset = 0, title = "", priority, completed } = paginationDto;

    const filters = {
      ...(title ? { title: ILike(`%${title}%`) } : {}),
      ...(priority ? { priority } : {}),
      ...(completed != undefined ? { completed: transformBoolean(completed) } : {})
    }

    const cacheKey = `tasks:${user.id}:${JSON.stringify({ limit, offset, filters })}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Usando cache con key: ${cacheKey}`)
      return cached;
    }

    const result = await this.taskRepository.findAndCount({
      where: {
        user: { id: user.id },
        ...filters
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    })

    const data = result?.[0]
    const total = result?.[1]
    const count = data.length;
    await this.cacheManager.set(cacheKey, { data, total, count }, 600000);
    return { data, total, count }
  }

  async findOne(id: number, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findOneRaw(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    const taskUpdated = { ...task, ...updateTaskDto };
    const result = await this.taskRepository.save(taskUpdated);

    if (updateTaskDto.completed === true && task.completed === false) {
      this.eventEmitter.emit('task.completed', result);
    }
    await this.cacheManager.del(`tasks:${user.id}`);
    return result;
  }

  async remove(id: number) {

    const task = await this.findOneRaw(id);
    return this.taskRepository.remove(task);
  }

  async populate(externalTasks: any[]) {
    const existingTitles = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.title')
      .getMany();

    const existingSet = new Set(existingTitles.map(t => t.title));

    const newTasks = externalTasks
      .filter(task => !existingSet.has(task.title))
      .map(task => ({
        title: task.title,
        completed: task.completed,
        userId: task.userId
      }));

    const inserted = await this.taskRepository.save(newTasks);
    return {
      message: `${inserted.length} tasks inserted`,
    };
  }

}

