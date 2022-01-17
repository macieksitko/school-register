/*
https://docs.nestjs.com/controllers#controllers
*/
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { UserDocument } from 'src/schemas';
import {
  AddStudentMarkDto,
  AssignStudentToCourseDto,
  UpdateStudentDto,
} from './dto';
import { StudentService } from './student.service';

@ApiTags('students')
@ApiBearerAuth('access-token')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  @Get()
  public async getStudents() {
    return this.studentService.findAll();
  }

  @Get('/:studentId')
  public async getStudent(@Param('studentId') studentId: string) {
    return this.studentService.findOne(studentId);
  }

  @Put('/:studentId')
  public async updateStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(updateStudentDto, studentId);
  }

  @Put('/:studentId/assign')
  public async assignStudentToCourse(
    @Body() assignStudentToCourseDto: AssignStudentToCourseDto,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.assignToCourse(
      assignStudentToCourseDto,
      studentId,
    );
  }

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

  @Put('/:studentId/mark/:markId')
  public async updateStudentMark(
    @CurrentAccount() currentAccount: UserDocument,
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
