import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Subject } from 'src/schemas';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsOptional()
  subjects?: Subject[];
}
