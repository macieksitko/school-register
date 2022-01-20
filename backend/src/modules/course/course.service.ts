import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/schemas';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    currentAccount: any,
  ): Promise<Course> {
    const course: Course = {
      ...createCourseDto,
      creationDate: new Date(),
      createdBy: currentAccount.name,
    };
    const createdCourse = await this.courseModel.create(course);
    return createdCourse;
  }

  async findOne(courseId: string): Promise<Course | undefined> {
    return this.courseModel.findById(courseId).lean();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().lean();
  }

  async update(
    updateCourseDto: UpdateCourseDto,
    courseId: string,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    course.name = updateCourseDto.name;

    course.save();
    return course;
  }
}
