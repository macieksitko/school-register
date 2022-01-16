/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Course,
  CourseSchema,
  Mark,
  MarkSchema,
  Student,
  StudentSchema,
  Subject,
  SubjectSchema,
  Teacher,
  TeacherSchema,
} from 'src/schemas';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
      {
        name: Teacher.name,
        schema: TeacherSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
      {
        name: Mark.name,
        schema: MarkSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
