import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from "express-session";
import * as passport from 'passport';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/HttpException.filter';
import { envs } from "./config";

async function bootstrap() {
  const logger = new Logger('main')
  const port = envs.port
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: envs.secretKeyJwt,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }
    }),
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  app.useGlobalFilters(new HttpExceptionFilter)
  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(port);
  logger.log(`listen to port: ${port}`)
}
bootstrap();
