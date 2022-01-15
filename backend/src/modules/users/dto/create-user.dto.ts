import { Role } from 'src/auth/roles/role.enum';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsEmail(IsEmail, { message: 'Provide valid e-mail address' })
  readonly email?: string;

  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(256, { message: 'Password can consists of max 256 characters' })
  readonly password: string;

  @IsEnum(Role, { message: `Role can be one of ${Object.values(Role)}` })
  readonly role: Role;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
