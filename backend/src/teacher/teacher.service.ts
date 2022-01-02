import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument, User } from 'src/schemas';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Request } from 'express';
import { UpdateTeacherDto } from './dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
  ) {}

  async create(
    createTeacherDto: CreateTeacherDto,
    currentAccount: User,
  ): Promise<Teacher> {
    const teacher: Teacher = {
      ...createTeacherDto,
      creationDate: new Date(),
      createdBy: currentAccount.name,
    };
    const createdTeacher = await this.teacherModel.create(teacher);
    return createdTeacher;
  }

  async findOne(teacherId: string): Promise<Teacher | undefined> {
    return this.teacherModel.findOne({ _id: teacherId }).lean();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().lean();
  }

  async update(
    updateTeacherDto: UpdateTeacherDto,
    teacherId: string,
  ): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(teacherId);
    teacher.email = updateTeacherDto.email;
    teacher.name = updateTeacherDto.name;
    teacher.lastName = updateTeacherDto.lastName;

    teacher.save();
    return teacher;
  }
}
