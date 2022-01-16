import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Mark,
  MarkDocument,
  Student,
  StudentDocument,
  Subject,
  SubjectDocument,
  Teacher,
  TeacherDocument,
  UserDocument,
} from 'src/schemas';
import { AddStudentMarkDto, CreateStudentDto, UpdateStudentDto } from './dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel('Mark')
    private readonly markModel: Model<MarkDocument>,
  ) {}

  // async create(
  //   createStudentDto: CreateStudentDto,
  //   //currentAccount: UserDocument,
  // ): Promise<Student> {
  //   //TODO: Mocked account id for tests

  //   const currentAccount = {
  //     _id: '61b9f0c9c9c19fcb32e303ee',
  //   };

  //   const student: Student = {
  //     ...createStudentDto,
  //     creationDate: new Date(),
  //     createdBy: currentAccount._id,
  //   };

  //   const createdStudent = await this.studentModel.create(student);

  //   return createdStudent;
  // }

  async findOne(studentId: string): Promise<Student | undefined> {
    return this.studentModel.findOne({ _id: studentId }).lean();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate('marks').lean();
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

  async addMark(
    addStudentMarkDto: AddStudentMarkDto,
    studentId: string,
    currentAccount: UserDocument,
  ) {
    const teacher = await this.teacherModel.findById({
      account: { _id: currentAccount._id },
    });

    const subject = await this.subjectModel.findById(
      addStudentMarkDto.subjectId,
    );

    const student = await this.studentModel.findById(studentId);

    const markBody: Mark = {
      ...addStudentMarkDto,
      creationDate: new Date(),
      createdBy: currentAccount._id,
      teacher,
      subject,
    };

    const mark = await this.markModel.create(markBody);

    student.marks.push(mark);

    student.populate('marks');
    student.save();
    return mark;
  }

  async updateMark(
    updateStudentMarkDto: AddStudentMarkDto,
    studentId: string,
    markId: string,
    currentAccount: UserDocument,
  ) {
    const teacher = await this.teacherModel.findById(currentAccount._id);
    const subject = await this.subjectModel.findById(
      updateStudentMarkDto.subjectId,
    );
    const student = await this.studentModel.findById(studentId);

    const markBody: Mark = {
      ...updateStudentMarkDto,
      creationDate: new Date(),
      createdBy: currentAccount._id,
      teacher,
      subject,
    };

    const mark = await this.markModel.create(markBody);

    student.marks.push(mark);

    student.save();
    return mark;
  }
}
