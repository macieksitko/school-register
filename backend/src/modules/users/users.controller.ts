import {
  Body,
  Controller,
  Post,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  //@Roles(Role.Admin)
  @Post('create')
  @ApiBody({ type: CreateUserDto })
  async create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    console.log(req.user);

    const {
      user: { username: creator, userId: creatorId },
    } = req;

    const { username, role } = createUserDto;

    this.logger.log(
      `User ${creator} is trying to create new user ${username} with role ${role}`,
    );

    const userExists = await this.usersService.userExists(username);
    if (userExists) {
      const msg = `Failed to create user - user ${username} already exists`;
      this.logger.error(msg);
      throw new BadRequestException(msg);
    }

    const createdUser = await this.usersService.create(
      createUserDto,
      creatorId,
    );

    if (createdUser) {
      this.logger.log(`User ${username} created successfully`);
      return { message: `User ${username} created successfully` };
    }

    this.logger.error(`Failed to create user ${username}`);
    return { error: `Failed to create user ${createUserDto}` };
  }
}
