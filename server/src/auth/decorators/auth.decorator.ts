import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/enums';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: Role[]) {
  if (roles.length > 0) {
    return applyDecorators(
      Roles(...roles),
      UseGuards(JwtAuthGuard, RolesGuard),
    );
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
}
