import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument, User } from 'src/schemas';
import { CreateStudentDto, UpdateStudentDto } from './dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
    currentAccount: User,
  ): Promise<Student> {
    const student: Student = {
      ...createStudentDto,
      creationDate: new Date(),
      createdBy: currentAccount.name,
    };
    const createdstudent = await this.studentModel.create(student);
    return createdstudent;
  }

  async findOne(studentId: string): Promise<Student | undefined> {
    return this.studentModel.findOne({ _id: studentId }).lean();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().lean();
  }

  async update(
    updatestudentDto: UpdateStudentDto,
    studentId: string,
  ): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    student.email = updatestudentDto.email;
    student.name = updatestudentDto.name;
    student.lastName = updatestudentDto.lastName;

    student.save();
    return student;
  }
}
