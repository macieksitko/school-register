import { ApiProperty } from '@nestjs/swagger';

export class AssignStudentToCourseDto {
  @ApiProperty()
  courseId: string;
}
