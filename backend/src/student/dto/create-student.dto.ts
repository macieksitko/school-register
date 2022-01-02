import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { Subject } from 'src/schemas';

export class CreateStudentDto {
  @IsEmail(IsEmail, { message: 'Provide valid e-mail address' })
  readonly email: string;
  @IsEnum(Role, { message: `Role can be one of ${Object.values(Role)}` })
  readonly role: Role;
  @IsString()
  readonly name: string;
  @IsString()
  readonly lastName: string;

  readonly subjects?: Subject[];
}
