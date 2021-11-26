import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password/password.service';

@Injectable()
export class AuthService {
  private static readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(usernameOrEmail);
    if (user && (await this.passwordService.verify(password, user.password))) {
      const { password: pass, ...result } = user;
      return result;
    }

    return null;
  }
}
