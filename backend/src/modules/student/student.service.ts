import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CurrentAccount } from 'src/common/interfaces';
import {
  Course,
  CourseDocument,
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
import {
  AddStudentMarkDto,
  AssignStudentToCourseDto,
  UpdateStudentDto,
} from './dto';

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
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  public async findOne(studentId: string): Promise<Student | undefined> {
    return this.studentModel
      .findOne({ _id: studentId })
      .populate('marks', 'subjects');
  }

  public async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate('marks', 'subjects');
  }

  public async update(
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

  public async assignToCourse(
    assignStudentToCourseDto: AssignStudentToCourseDto,
    studentId: string,
  ): Promise<Student> {
    const { courseId } = assignStudentToCourseDto;

    const course = await this.courseModel.findById(courseId);
    const student = await this.studentModel.findById(studentId);

    student.courses.push(course);
    student.populate('course');
    student.save();

    return student;
  }

  public async addMark(
    addStudentMarkDto: AddStudentMarkDto,
    studentId: string,
    currentAccount: any,
  ) {
    const teacher = await this.teacherModel.findOne({
      account: currentAccount.userId,
    });

    if (!teacher)
      throw new UnauthorizedException('Only teacher can add a mark.');

    const subject = await this.subjectModel.findById(
      addStudentMarkDto.subjectId,
    );

    const markBody: Mark = {
      ...addStudentMarkDto,
      creationDate: new Date(),
      createdBy: currentAccount._id,
      teacher,
      subject,
    };

    const mark = await this.markModel.create(markBody);
    console.log(mark);

    const student = await this.studentModel
      .findOneAndUpdate({ _id: studentId }, { $push: { marks: mark } })
      .populate('marks');

    console.log(student);

    return mark;
  }

  public async updateMark(
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
