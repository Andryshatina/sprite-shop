import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.getOrThrow('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-01-28.clover',
    });
  }

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

  async createCheckoutSession(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId)
      throw new ForbiddenException(
        'You are not authorized to access this order',
      );
    if (order.status === 'PAID')
      throw new BadRequestException('Order is already paid');

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          description: item.product.description,
          images: [
            `${this.config.getOrThrow('R2_PUBLIC_URL')}/images/${item.product.imageKey}`,
          ],
        },
        unit_amount: item.product.price,
      },
      quantity: 1,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',

      success_url: `${this.config.getOrThrow('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.config.getOrThrow('FRONTEND_URL')}/cancel`,

      metadata: {
        orderId: order.id,
      },

      customer_email: order.user.email,
    });
    return { url: session.url };
  }

  async verifyPayment(userId: number, sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const orderId = Number(session.metadata?.orderId);

        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.userId !== userId)
          throw new ForbiddenException(
            'You are not authorized to access this order',
          );

        if (order.status === 'PAID') return { message: 'Order already paid' };

        if (order.status === 'PENDING') {
          await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });
        }
        return {
          success: true,
          message: 'Payment verified successfully',
          orderId,
        };
      }

      return {
        success: false,
        message: 'Payment not verified',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid session ID');
    }
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
