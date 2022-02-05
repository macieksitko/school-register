/*
https://docs.nestjs.com/controllers#controllers
*/
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import {
  AddStudentMarkDto,
  AssignStudentToCourseDto,
  AssignStudentToSubjectDto,
  UpdateStudentDto,
} from './dto';
import { StudentService } from './student.service';

@ApiTags('students')
@ApiBearerAuth('access-token')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Roles(Role.Admin, Role.Teacher)
  @Get()
  public async getStudents() {
    return this.studentService.findAll();
  }

  @Roles(Role.Admin, Role.Student)
  @Get('/:studentId')
  public async getStudent(@Param('studentId') studentId: string) {
    return this.studentService.findOne(studentId);
  }

  @Roles(Role.Admin)
  @Put('/:studentId')
  public async updateStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(updateStudentDto, studentId);
  }

  @Roles(Role.Admin)
  @Put('/:studentId/assign-course')
  public async assignStudentToCourse(
    @Body() assignStudentToCourseDto: AssignStudentToCourseDto,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.assignToCourse(
      assignStudentToCourseDto,
      studentId,
    );
  }

  @Roles(Role.Admin)
  @Put('/:studentId/assign-subject')
  public async assignStudentToSubject(
    @Body() assignStudentToSubjectDto: AssignStudentToSubjectDto,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.assignToSubject(
      assignStudentToSubjectDto,
      studentId,
    );
  }

  @Roles(Role.Admin, Role.Teacher)
  @Post('/:studentId/mark')
  public async addStudentMark(
    @CurrentAccount() currentAccount: any,
    @Param('studentId') studentId: string,
    @Body() addStudentMarkDto: AddStudentMarkDto,
  ) {
    return this.studentService.addMark(
      addStudentMarkDto,
      studentId,
      currentAccount,
    );
  }

  @Roles(Role.Admin, Role.Teacher)
  @Put('/:studentId/mark/:markId')
  public async updateStudentMark(
    @CurrentAccount() currentAccount: any,
    @Param('studentId') studentId: string,
    @Param('markId') markId: string,
    @Body() addStudentMarkDto: AddStudentMarkDto,
  ) {
    return this.studentService.updateMark(
      addStudentMarkDto,
      studentId,
      markId,
      currentAccount,
    );
  }
}
