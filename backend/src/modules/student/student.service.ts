import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  CreateStudentDto,
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
    return this.studentModel.findOne({ _id: studentId }).lean();
  }

  public async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate('marks', 'subjects').lean();
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
