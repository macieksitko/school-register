import { IsOptional, IsString } from 'class-validator';
import { Subject } from 'src/schemas';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsOptional()
  subjects?: Subject[];
}
