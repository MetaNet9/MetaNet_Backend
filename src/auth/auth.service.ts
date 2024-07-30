// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, roles } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hashedPassword, roles });
    return this.login(user);
  }

  async googleLogin(user: any) {
    const existingUser = await this.usersService.findOneByGoogleId(user.id);
    if (existingUser) {
      const payload = { email: existingUser.email, sub: existingUser.id, roles: existingUser.roles };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    const newUser = await this.usersService.create({
      email: user.emails[0].value,
      googleId: user.id,
      roles: [UserRole.USER],
    });
    const payload = { email: newUser.email, sub: newUser.id, roles: newUser.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
