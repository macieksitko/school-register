import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/app.controller';
import { UsersService } from 'src/modules/users/users.service';
import { PasswordService } from './password/password.service';

@Injectable()
export class AuthService {
  private static readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(usernameOrEmail);
    if (user && (await this.passwordService.verify(password, user.password))) {
      const { password: pass, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      iss: 'school_register',
      username: user.username,
      sub: user._id,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
