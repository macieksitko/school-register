import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/schemas/user.schema';
import { UsersService } from './users/users.service';

async function initDatabase(app: INestApplication) {
  const logger = new Logger('DatabaseBootstrap');
  const usersService = app.get(UsersService);
  const isDefaultUserExisting = await usersService.defaultUserExists();
  if (isDefaultUserExisting) {
    logger.log('Default admin user already exists, skipping its creation');
    return;
  }
  const defaultUser: CreateUserDto = {
    username: 'admin',
    email: 'example@domain.com',
    password: Math.random().toString(36).slice(2),
    role: 'admin',
    name: 'admin',
    lastName: 'admin',
  };

  const { username }: User = await usersService.create(defaultUser);

  logger.log(
    `Created default user ${username}:${defaultUser.password}, please use this credentials for first login and immediately change your password`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverPort = app.get(ConfigService).get<number>('server.port');
  app.setGlobalPrefix('/api');

  /** Setup Swagger */
  const config = new DocumentBuilder()
    .setTitle('School registry')
    .setDescription('School registry API description')
    .setVersion('1.0')
    .addTag('school-registry')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(serverPort);
  const serverUrl = await app.getUrl();
  new Logger('ServerBootstrap').log(`Server listening on ${serverUrl}`);

  return app;
}

bootstrap().then(initDatabase);
