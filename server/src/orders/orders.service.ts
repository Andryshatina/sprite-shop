import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Role, OrderStatus } from '../generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private stripeService: StripeService,
  ) {}

  async create(userId: number, productIds: number[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (productIds.length !== products.length)
      throw new NotFoundException('Some products not found or unavailable');

    const total = products.reduce((acc, product) => acc + product.price, 0);

    return this.prisma.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PENDING,
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
    if (order.status === OrderStatus.PAID)
      throw new BadRequestException('Order is already paid');

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          description: item.product.description,
          images: [
            `${this.config.getOrThrow<string>('R2_PUBLIC_URL')}/${item.product.imageKey}`,
          ],
        },
        unit_amount: item.product.price,
      },
      quantity: 1,
    }));

    const session = await this.stripeService.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',

      success_url: `${this.config.getOrThrow<string>('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.config.getOrThrow<string>('FRONTEND_URL')}/cancel`,

      metadata: {
        orderId: order.id,
      },

      customer_email: order.user.email,
    });
    return { url: session.url };
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.config.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;
    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        this.logger.log(`Payment completed for order: ${orderId}`);

        await this.prisma.order.update({
          where: { id: +orderId },
          data: {
            status: OrderStatus.PAID,
            stripeSessionId: session.id,
          },
        });
      }
    }

    return { success: true };
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, requestingUserId: number, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    if (role !== Role.ADMIN && order.userId !== requestingUserId) {
      throw new ForbiddenException(
        'You are not authorized to access this order',
      );
    }
    return order;
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return this.prisma.order.delete({ where: { id } });
  }
}
