import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class OrdersService {
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
      Logger.error('Webhook signature verification failed', error);
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        Logger.log('Payment completed for order:', orderId);

        await this.prisma.order.update({
          where: { id: +orderId },
          data: {
            status: 'PAID',
            stripeSessionId: session.id,
          },
        });
      }
    }

    return { success: true };
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
