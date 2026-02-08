import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { type UserWithoutPassword } from '../types/auth-types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, pass: string): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) throw new UnauthorizedException('Wrong email or password');

    return user;
  }
}
