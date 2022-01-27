/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@ApiTags('courses')
@ApiBearerAuth('access-token')
@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Roles(Role.Admin, Role.Teacher)
  @Get()
  public async getCourses() {
    return this.courseService.findAll();
  }

  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:courseId')
  public async getCourse(@Param('courseId') courseId: string) {
    return this.courseService.findOne(courseId);
  }

  @Roles(Role.Admin)
  @Post()
  public async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentAccount() currentAccount: any,
  ) {
    return this.courseService.create(createCourseDto, currentAccount);
  }

  @Roles(Role.Admin)
  @Put('/:courseId')
  public async updateCourse(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(updateCourseDto, courseId);
  }
}
