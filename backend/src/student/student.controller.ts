/*
https://docs.nestjs.com/controllers#controllers
*/
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/schemas';
import { CreateStudentDto, UpdateStudentDto } from './dto';
import { StudentService } from './student.service';

@ApiTags('students')
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

  @Post()
  public async createStudent(
    @Body() createStudentrDto: CreateStudentDto,
    @CurrentAccount() currentAccount: User,
  ) {
    return this.studentService.create(createStudentrDto, currentAccount);
  }

  @Put('/:studentId')
  public async updateStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(updateStudentDto, studentId);
  }
}
