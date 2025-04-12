import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { envs } from './config';
import { Task } from './tasks/entities/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,

  }),
  TypeOrmModule.forRootAsync({
    imports: [
      ConfigModule,
      CacheModule.register({ isGlobal: true }),
      EventEmitterModule.forRoot(),
      ThrottlerModule.forRoot({
        throttlers: [
          {
            ttl: 60000,
            limit: 5,
          },
        ],
      }),
    ],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: envs.hostDb,
      port: envs.portDb,
      username: envs.usernameDb,
      password: envs.dbKey,
      database: envs.db,
      entities: [User, Task],
      synchronize: true,
    }
    ),
  }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
