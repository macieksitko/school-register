import { IsOptional, IsString } from 'class-validator';
import { Subject } from 'src/schemas';

export class UpdateCourseDto {
  @IsString()
  name?: string;

  @IsOptional()
  subjects?: Subject[];
}
