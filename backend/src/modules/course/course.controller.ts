/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/schemas';
import { UpdateCourseDto, CreateCourseDto } from './dto';
import { CourseService } from './course.service';

@ApiTags('courses')
@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  public async getCourses() {
    return this.courseService.findAll();
  }

  @Get('/:courseId')
  public async getCourse(@Param('courseId') courseId: string) {
    return this.courseService.findOne(courseId);
  }

  @Post()
  public async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentAccount() currentAccount: User,
  ) {
    return this.courseService.create(createCourseDto, currentAccount);
  }

  @Put('/:courseId')
  public async updateCourse(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(updateCourseDto, courseId);
  }
}
