import { ApiProperty } from '@nestjs/swagger';

export class AssignTeacherToSubjectDto {
  @ApiProperty()
  subjectId: string;
}
