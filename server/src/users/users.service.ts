import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prisma: PrismaService) {}
  private readonly roundsOfHash = 10;

  private excludePassword(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnprocessableEntityException('User already exists');
    }
    const hashedPass = await bcrypt.hash(
      createUserDto.password,
      this.roundsOfHash,
    );
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPass,
      },
    });
    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return this.excludePassword(user);
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return this.excludePassword(user);
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
