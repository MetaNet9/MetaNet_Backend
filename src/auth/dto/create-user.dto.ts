// auth/dto/create-user.dto.ts
import { UserRole } from '../../users/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  roles: UserRole[];
}
