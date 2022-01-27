/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { AssignTeacherToSubjectDto, UpdateTeacherDto } from './dto';
import { TeacherService } from './teacher.service';

@ApiTags('teachers')
@ApiBearerAuth('access-token')
@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Roles(Role.Admin)
  @Get()
  public async getTeachers() {
    return this.teacherService.findAll();
  }

  @Roles(Role.Admin, Role.Teacher)
  @Get('/:teacherId')
  public async getTeacher(@Param('teacherId') teacherId: string) {
    return this.teacherService.findOne(teacherId);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Get('/:teacherId/subject')
  public async getTeacherSubjects(@Param('teacherId') teacherId: string) {
    return this.teacherService.findSubjects(teacherId);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Put('/:teacherId')
  @ApiBody({ type: UpdateTeacherDto })
  public async updateTeacher(
    @Param('teacherId') teacherId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(updateTeacherDto, teacherId);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Put('/:teacherId/assign-subject')
  public async assignStudentToSubject(
    @Body() assignTeacherToSubjectDto: AssignTeacherToSubjectDto,
    @Param('teacherId') teacherId: string,
  ) {
    return this.teacherService.assignToSubject(
      assignTeacherToSubjectDto,
      teacherId,
    );
  }
}
