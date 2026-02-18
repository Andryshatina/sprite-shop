import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, productIds: number[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (productIds.length !== products.length)
      throw new NotFoundException('Some products not found or unavailable');

    const total = products.reduce((acc, product) => acc + product.price, 0);

    const order = this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: products.map((product) => ({
            productId: product.id,
            price: product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
