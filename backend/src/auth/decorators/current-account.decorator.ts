import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/schemas';

export const CurrentAccount = createParamDecorator(
  (_, ctx: ExecutionContext): UserDocument => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
