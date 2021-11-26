import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new BadRequestException(info);
    }
    return user;
  }
}
