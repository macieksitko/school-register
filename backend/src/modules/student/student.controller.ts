/*
https://docs.nestjs.com/controllers#controllers
*/
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { UserDocument } from 'src/schemas';
import { AddStudentMarkDto, CreateStudentDto, UpdateStudentDto } from './dto';
import { StudentService } from './student.service';

@ApiTags('students')
@ApiBearerAuth('access-token')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  @Get()
  public async getTeachers() {
    return this.studentService.findAll();
  }

  @Get('/:studentId')
  public async getStudent(@Param('studentId') studentId: string) {
    return this.studentService.findOne(studentId);
  }

  @Put('/:studentId')
  @ApiBody({ type: UpdateStudentDto })
  public async updateStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(updateStudentDto, studentId);
  }

  @Post('/:studentId/mark')
  @ApiBody({ type: AddStudentMarkDto })
  public async addStudentMark(
    @CurrentAccount() currentAccount: UserDocument,
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
  @ApiBody({ type: AddStudentMarkDto })
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
