import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @ApiProperty()
  @IsString()
  readonly subjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly from?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly to?: Date;
}
