import { IsOptional, IsString } from 'class-validator';
import { Course, Teacher } from 'src/schemas';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  teacher?: Teacher;

  @IsOptional()
  course?: Course;
}
