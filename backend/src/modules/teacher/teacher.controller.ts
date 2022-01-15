/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/schemas';
import { CreateTeacherDto, UpdateTeacherDto } from './dto';
import { TeacherService } from './teacher.service';

@ApiTags('teachers')
@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get()
  public async getTeachers() {
    return this.teacherService.findAll();
  }

  @Get('/:teacherId')
  public async getTeacher(@Param('teacherId') teacherId: string) {
    return this.teacherService.findOne(teacherId);
  }

  @Get('/:teacherId/subject')
  public async getTeacherSubjects(@Param('teacherId') teacherId: string) {
    return this.teacherService.findSubjects(teacherId);
  }

  @Post()
  @ApiBody({ type: CreateTeacherDto })
  public async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
    @CurrentAccount() currentAccount: User,
  ) {
    return this.teacherService.create(createTeacherDto, currentAccount);
  }

  @Put('/:teacherId')
  @ApiBody({ type: UpdateTeacherDto })
  public async updateTeacher(
    @Param('teacherId') teacherId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(updateTeacherDto, teacherId);
  }
}
