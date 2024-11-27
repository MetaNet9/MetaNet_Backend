import { Controller, Post, UseGuards, Request, Body, Get, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: { email: string, password: string }, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const token = await this.authService.login(user);
      res.cookie('access_token', token.access_token, { httpOnly: true }); // Set the cookie
      return res.send({ success: true });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const token = await this.authService.register(createUserDto);
      return res.send({ success: true });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findByVerificationToken(token);
      if (!user) {
        throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
      }

      user.isVerified = true;
      user.verificationToken = null; // Clear the token
      await this.usersService.update(user.id, user);

      return res.send({ message: 'Email successfully verified! You can now log in.' });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
 }


  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    return req.user;
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const token = await this.authService.googleLogin(req.user);
      res.cookie('access_token', token.access_token, { httpOnly: true }); // Set the cookie
      return res.send({ success: true });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


