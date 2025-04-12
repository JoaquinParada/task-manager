import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Roles } from 'src/common/enums/role.enums';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(User);

    await userRepository.delete({});

    const users = [];
    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `user${i}`,
            password: '123456',
            role: Roles.User,
        });
    }

    // Agregar un admin
    users.push({
        username: 'admin',
        password: 'admin123',
        role: Roles.Admin,
    });

    await userRepository.save(users);

    await app.close();
}

bootstrap();
