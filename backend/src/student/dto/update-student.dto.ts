import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { Subject } from 'src/schemas';

export class UpdateStudentDto {
  @IsOptional()
  @IsEmail(IsEmail, { message: 'Provide valid e-mail address' })
  readonly email?: string;

  @IsOptional()
  @IsEnum(Role, { message: `Role can be one of ${Object.values(Role)}` })
  readonly role?: Role;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  readonly subjects?: Subject[];
}
