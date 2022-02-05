import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorators/public.decorator';
import { LocalAuthGuard } from './auth/guards/local.guard';

export class LoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

@ApiBearerAuth('access-token')
@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
