import { Request } from 'express';
import { User } from '../../generated/prisma/client';
export type UserWithoutPassword = Omit<User, 'password'>;

export interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}
