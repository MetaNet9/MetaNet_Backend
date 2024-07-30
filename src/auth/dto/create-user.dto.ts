// auth/dto/create-user.dto.ts
import { UserRole } from '../../users/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  roles: UserRole[];
}
