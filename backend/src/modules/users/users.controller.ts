import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@Roles(Role.Admin)
  @Post('create')
  @ApiBody({ type: CreateUserDto })
  async create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto, req);
  }
}
