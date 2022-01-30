import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, Subject, Teacher, TeacherDocument, User } from 'src/schemas';
import { AssignTeacherToSubjectDto, UpdateTeacherDto } from './dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<TeacherDocument>,
  ) {}

  // async create(
  //   createTeacherDto: CreateTeacherDto,
  //   currentAccount: User,
  // ): Promise<Teacher> {
  //   const teacher: Teacher = {
  //     ...createTeacherDto,
  //     creationDate: new Date(),
  //     createdBy: currentAccount.name,
  //   };
  //   const createdTeacher = await this.teacherModel.create(teacher);
  //   return createdTeacher;
  // }

  async findOne(teacherId: string): Promise<Teacher | undefined> {
    return this.teacherModel.findById(teacherId).populate('subjects');
  }

  async findOneByAccountId(
    accountId: string,
  ): Promise<TeacherDocument | undefined> {
    return this.teacherModel.findOne({ account: accountId });
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().populate('subjects').lean();
  }

  async update(
    updateTeacherDto: UpdateTeacherDto,
    teacherId: string,
  ): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(teacherId);
    teacher.email = updateTeacherDto.email;
    teacher.name = updateTeacherDto.name;
    teacher.lastName = updateTeacherDto.lastName;
    teacher.subjects.push(...updateTeacherDto.subjects);

    teacher.save();
    return teacher;
  }

  async findSubjects(teacherId: string): Promise<Subject[]> {
    const teacher = await this.teacherModel
      .findOne({ account: teacherId })
      .populate('subjects');

    return teacher.subjects;
  }

  public async assignToSubject(
    assignTeacherToSubjectDto: AssignTeacherToSubjectDto,
    teacherId: string,
  ): Promise<Student> {
    const { subjectId } = assignTeacherToSubjectDto;

    const subject = await this.subjectModel.findById(subjectId);
    const student = await this.teacherModel.findOneAndUpdate(
      { _id: teacherId },
      { $push: { subjects: subject } },
    );

    return student;
  }
}
