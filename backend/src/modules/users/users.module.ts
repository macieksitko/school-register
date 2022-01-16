import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Student,
  StudentSchema,
  Teacher,
  TeacherSchema,
  User,
  UserSchema,
} from 'src/schemas';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Teacher.name,
        schema: TeacherSchema,
      },
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
