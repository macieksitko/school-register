import { ApiProperty } from '@nestjs/swagger';

export class AssignStudentToSubjectDto {
  @ApiProperty()
  subjectId: string;
}
