import { Role } from 'src/auth/roles/role.enum';

export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: Role;
  readonly name: string;
  readonly lastName: string;
}
