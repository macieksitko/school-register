/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/schemas';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { SubjectService } from './subject.service';

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
    @CurrentAccount() currentAccount: User,
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
}
