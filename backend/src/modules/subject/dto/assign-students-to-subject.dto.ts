import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignStudentsToSubjectDto {
  @ApiProperty()
  @IsString({ each: true })
  studentIds: string[];
}
