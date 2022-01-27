/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { UserDocument } from 'src/schemas';
import {
  AssignStudentsToSubjectDto,
  CreateSubjectDto,
  UpdateSubjectDto,
} from './dto';
import { SubjectService } from './subject.service';

@ApiBearerAuth('access-token')
@ApiTags('subjects')
@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  public async getSubjects() {
    return this.subjectService.findAll();
  }

  @Get('/:subjectId')
  public async getSubject(@Param('subjectId') subjectId: string) {
    return this.subjectService.findOne(subjectId);
  }

  @Get('/:subjectId/students')
  public async getSubjectStudents(@Param('subjectId') subjectId: string) {
    return this.subjectService.findSubjectStudents(subjectId);
  }

  @Post()
  @ApiBody({ type: CreateSubjectDto })
  public async createCourse(
    @Body() createSubjectDto: CreateSubjectDto,
    @CurrentAccount() currentAccount: UserDocument,
  ) {
    return this.subjectService.create(createSubjectDto, currentAccount);
  }

  @Put('/:subjectId')
  @ApiBody({ type: UpdateSubjectDto })
  public async updateSubject(
    @Param('subjectId') subjectId: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(updateSubjectDto, subjectId);
  }

  @Post('/:subjectId/students')
  public async assignStudentsToSubject(
    @Param('subjectId') subjectId: string,
    @Body() assignnStudentsToSubject: AssignStudentsToSubjectDto,
  ) {
    return this.subjectService.assignStudentsToSubject(
      assignnStudentsToSubject,
      subjectId,
    );
  }
}
