import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Course,
  Student,
  StudentDocument,
  Subject,
  SubjectDocument,
  User,
} from 'src/schemas';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    currentAccount: User,
  ): Promise<Subject> {
    const subject: Subject = {
      ...createSubjectDto,
      creationDate: new Date(),
      //createdBy: currentAccount.name,
    };
    const createdSubject = await this.subjectModel.create(subject);
    return createdSubject;
  }

  async findOne(subjectId: string): Promise<Subject | undefined> {
    return this.subjectModel.findOne({ _id: subjectId }).lean();
  }

  async findSubjectStudents(subjectId: string): Promise<Student[]> {
    const subject = await this.subjectModel.findById(subjectId);
    const students = await this.studentModel.find({
      subjects: subject,
    });
    return students;
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().lean();
  }

  async update(
    updateSubjectDto: UpdateSubjectDto,
    subjectId: string,
  ): Promise<Subject> {
    const subject = await this.subjectModel.findById(subjectId);
    subject.name = updateSubjectDto.name;

    subject.save();
    return subject;
  }
}
