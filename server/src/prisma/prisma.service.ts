import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Налаштовуємо адаптер
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Передаємо адаптер у батьківський клас PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Цей метод NestJS викликає автоматично при старті додатка
    await this.$connect();
  }
}
