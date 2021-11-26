import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    this.logger.log(
      `User ${usernameOrEmail} trying to sign in, validating its credentials`,
    );
    const user = await this.authService.validateUser(usernameOrEmail, password);
    if (!user) {
      this.logger.warn(`User ${usernameOrEmail} not authenticated`);
      throw new UnauthorizedException();
    }
    this.logger.log(`User ${usernameOrEmail} authenticated successfully`);
    return user;
  }
}
