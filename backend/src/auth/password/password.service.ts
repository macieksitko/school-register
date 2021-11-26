import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private static readonly bcryptRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordService.bcryptRounds);
  }

  async verify(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
