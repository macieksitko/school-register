import { Role } from 'src/auth/roles/role.enum';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail(IsEmail, { message: 'Provide valid e-mail address' })
  readonly email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(256, { message: 'Password can consists of max 256 characters' })
  readonly password: string;

  @ApiProperty()
  @IsEnum(Role, { message: `Role can be one of ${Object.values(Role)}` })
  readonly role: Role;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
