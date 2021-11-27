import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { PasswordService } from 'src/auth/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private passwordService: PasswordService,
  ) {}

  async userExists(usernameOrEmail: string): Promise<boolean> {
    return this.userModel.exists({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async create(createUserDto: CreateUserDto, creatorId: string): Promise<User> {
    const user: User = {
      ...createUserDto,
      password: await this.passwordService.hash(createUserDto.password),
      creationDate: new Date(),
      createdBy: creatorId,
    };
    const createdUser = (await this.userModel.create(user)).populate(
      'createdBy',
    );
    return createdUser;
  }

  async findOne(usernameOrEmail: string): Promise<User | undefined> {
    return this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .lean();
  }
}
