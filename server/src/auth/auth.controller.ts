import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/user.decorator';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { type RequestWithUser } from './types/auth-types';
import { Auth } from './decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() authDto: AuthDto, @Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Auth(Role.ADMIN)
  @Get('profile')
  getProfile(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }
}
