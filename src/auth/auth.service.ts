// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password, roles, userName } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      roles,
      firstName,
      lastName,
      userName,
    });

    return this.login(user);
  }

  async googleLogin(user: any) {
    let existingUser = await this.usersService.findOneByGoogleId(user.id);
    if (!existingUser) {
      existingUser = await this.usersService.create({
        email: user.emails[0].value,
        googleId: user.id,
        roles: [UserRole.USER],
      });
    }

    const payload = { email: existingUser.email, sub: existingUser.id, roles: existingUser.roles };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY }),
    };
  }
}
