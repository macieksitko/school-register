import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { PasswordService } from 'src/auth/password/password.service';
import { Role } from 'src/auth/roles/role.enum';
import {
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
} from 'src/schemas';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,

    private passwordService: PasswordService,
  ) {
    this.logger = new Logger('Users');
  }

  public async userExists(usernameOrEmail: string): Promise<boolean> {
    return this.userModel.exists({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  public async create(
    createUserDto: CreateUserDto,
    request: any,
  ): Promise<User> {
    const {
      user: { username: creator, userId: creatorId },
    } = request;

    const { username, role } = createUserDto;

    this.logger.log(
      `User ${creator} is trying to create new user ${username} with role ${role}`,
    );

    const userExists = await this.userExists(username);

    if (userExists) {
      const msg = `Failed to create user - user ${username} already exists`;
      this.logger.error(msg);
      throw new BadRequestException(msg);
    }

    const user: User = {
      ...createUserDto,
      password: await this.passwordService.hash(createUserDto.password),
      creationDate: new Date(),
      createdBy: creatorId,
    };
    const createdUser = (await this.userModel.create(user)).populate(
      'createdBy',
    );

    if (!createdUser) {
      this.logger.error(`Failed to create user ${username}`);
      throw new BadRequestException(`Failed to create user ${createUserDto}`);
    }

    switch (role) {
      case Role.Student: {
        await this.studentModel.create({
          ...createUserDto,
          creationDate: new Date(),
          createdBy: creatorId,
        });
      }
      case Role.Teacher: {
        await this.teacherModel.create({
          ...createUserDto,
          creationDate: new Date(),
          createdBy: creatorId,
        });
      }
    }

    this.logger.log(`User ${username} created successfully with role ${role}`);

    return createdUser;
  }

  public async findOne(usernameOrEmail: string): Promise<User | undefined> {
    return this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .lean();
  }
}
