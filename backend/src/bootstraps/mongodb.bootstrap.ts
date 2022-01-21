import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Role } from 'src/auth/roles/role.enum';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';

export const databaseBootstrap = async (
  app: NestExpressApplication,
): Promise<void> => {
  const logger = new Logger('DatabaseBootstrap');
  const usersService = app.get(UsersService);
  const isDefaultUserExisting = await usersService.userExists('admin');
  if (isDefaultUserExisting) {
    logger.log(`Default 'admin' user already exists, skipping its creation`);
    return;
  }
  const defaultUser: CreateUserDto = {
    username: 'admin',
    email: 'example@domain.com',
    password: Math.random().toString(36).slice(2),
    role: Role.Admin,
    name: 'admin',
    lastName: 'admin',
  };

  const { username }: User = await usersService.createAdmin(defaultUser, null);

  logger.log(
    `Created default user ${username}:${defaultUser.password}, please use this credentials for first login and immediately change your password`,
  );
};
