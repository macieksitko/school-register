import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { MarkType } from 'src/common/enums';

export class AddStudentMarkDto {
  @ApiProperty()
  @IsOptional()
  comment?: string;

  @ApiProperty()
  grade: string;

  @ApiProperty()
  @IsEnum(MarkType)
  markType: MarkType;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  @IsNumber()
  termNumber: number;

  @ApiProperty()
  subjectId: string;
}
