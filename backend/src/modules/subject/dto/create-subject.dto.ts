import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Course, Teacher } from 'src/schemas';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  teacherIds?: string[];

  @ApiProperty()
  @IsOptional()
  courseId?: string;
}
