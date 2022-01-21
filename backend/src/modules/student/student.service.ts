import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
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
  AssignStudentToSubjectDto,
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
    @InjectModel(Mark.name)
    private readonly markModel: Model<MarkDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  public async findOne(studentId: string): Promise<Student | undefined> {
    const student = await this.studentModel
      .findOne({ account: studentId })
      .populate('marks')
      .populate('subjects');

    if (!student) throw new NotFoundException('Student does not exist.');

    return student;
  }

  public async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate('marks').populate('subjects');
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
    const student = await this.studentModel.findOneAndUpdate(
      { _id: studentId },
      { $push: { courses: course } },
    );

    return student;
  }

  public async assignToSubject(
    assignStudentToSubjectDto: AssignStudentToSubjectDto,
    studentId: string,
  ): Promise<Student> {
    const { subjectId } = assignStudentToSubjectDto;

    const subject = await this.subjectModel.findById(subjectId);
    const student = await this.studentModel.findOneAndUpdate(
      { _id: studentId },
      { $push: { subjects: subject } },
    );

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

    const student = await this.studentModel.findOneAndUpdate(
      { _id: studentId },
      { $push: { marks: mark } },
    );

    return student;
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
