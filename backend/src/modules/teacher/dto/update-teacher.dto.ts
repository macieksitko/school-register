import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { Subject } from 'src/schemas';

export class UpdateTeacherDto {
  @IsOptional()
  @ApiProperty()
  readonly email?: string;

  @IsOptional()
  @ApiProperty()
  readonly role?: Role;

  @IsOptional()
  @ApiProperty()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @ApiProperty()
  readonly subjects?: Subject[];
}
