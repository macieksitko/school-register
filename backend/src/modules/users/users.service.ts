import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
export class UsersService implements OnApplicationBootstrap {
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

  async onApplicationBootstrap(): Promise<void> {
    const defaultUserExists = await this.userExists('admin');
    if (defaultUserExists) {
      this.logger.log(
        `Default 'admin' user already exists, skipping its creation process`,
      );
      return;
    }
    const defaultUser: CreateUserDto = {
      username: 'admin',
      email: 'example@domain.com',
      password: Math.random().toString(36).slice(2),
      role: Role.Admin,
      name: 'admin',
      lastName: 'admin',
    };

    const { username }: User = await this.createAdmin(defaultUser);

    this.logger.log(
      `Created default user ${username} with password ${defaultUser.password}, please use this credentials for first login and immediately change your password`,
    );
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
    const createdUser = await this.userModel.create(user);

    if (!createdUser) {
      this.logger.error(`Failed to create user ${username}`);
      throw new BadRequestException(`Failed to create user ${createUserDto}`);
    }

    if (role === Role.Student) {
      await this.studentModel.create({
        ...createUserDto,
        creationDate: new Date(),
        account: createdUser,
        createdBy: creatorId,
      });
    } else if (role === Role.Teacher) {
      await this.teacherModel.create({
        ...createUserDto,
        account: createdUser,
        creationDate: new Date(),
        createdBy: creatorId,
      });
    } else
      throw new BadRequestException(`Failed to create user ${createUserDto}`);

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

  async createAdmin(createUserDto: CreateUserDto, creatorId?: string) {
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
}
