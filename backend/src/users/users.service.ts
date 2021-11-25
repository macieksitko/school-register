import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltOrRounds = 10;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async defaultUserExists(): Promise<boolean> {
    return this.userModel.exists({ username: 'admin' });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, this.saltOrRounds),
      creationDate: new Date(),
      createdBy: null,
    };
    const createdUser = this.userModel.create(user);
    return createdUser;
  }
}
