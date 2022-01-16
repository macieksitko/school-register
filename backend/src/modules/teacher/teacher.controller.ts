/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateTeacherDto } from './dto';
import { TeacherService } from './teacher.service';

@ApiTags('teachers')
@ApiBearerAuth('access-token')
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

  @Put('/:teacherId')
  @ApiBody({ type: UpdateTeacherDto })
  public async updateTeacher(
    @Param('teacherId') teacherId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(updateTeacherDto, teacherId);
  }
}
