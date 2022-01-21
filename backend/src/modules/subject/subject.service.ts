import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Student,
  StudentDocument,
  Subject,
  SubjectDocument,
  Teacher,
  TeacherDocument,
  UserDocument,
} from 'src/schemas';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
  ) {}

  public async create(
    createSubjectDto: CreateSubjectDto,
    currentAccount: UserDocument,
  ): Promise<Subject> {
    const { teacherIds } = createSubjectDto;

    const teachers = await this.teacherModel.find({
      _id: { $in: teacherIds },
    });

    const subject: Subject = {
      creationDate: new Date(),
      createdBy: currentAccount._id,
      teachers,
      ...createSubjectDto,
    };

    const createdSubject = await (
      await this.subjectModel.create(subject)
    ).populate('teachers');

    await this.teacherModel
      .updateMany(
        { _id: { $in: teacherIds } },
        { $push: { subjects: createdSubject._id } },
      )
      .populate('subjects');

    return createdSubject;
  }

  public async findOne(subjectId: string): Promise<Subject | undefined> {
    return this.subjectModel.findOne({ _id: subjectId }).lean();
  }

  public async findSubjectStudents(subjectId: string): Promise<Student[]> {
    const subject = await this.subjectModel.findById(subjectId);

    const students = await this.studentModel.find({
      subjects: subject,
    });

    return students;
  }

  public async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().lean();
  }

  public async update(
    updateSubjectDto: UpdateSubjectDto,
    subjectId: string,
  ): Promise<Subject> {
    const subject = await this.subjectModel.findById(subjectId);
    subject.name = updateSubjectDto.name;

    subject.save();
    return subject;
  }
}
