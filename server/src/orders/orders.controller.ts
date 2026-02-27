import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  type RawBodyRequest,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { type RequestWithUser } from 'src/auth/types/auth-types';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.create(user.id, createOrderDto.productIds);
  }

  @Auth()
  @Post(':id/checkout')
  @HttpCode(HttpStatus.CREATED)
  createCheckoutSession(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.createCheckoutSession(user.id, +id);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() req: RawBodyRequest<Express.Request>,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Raw body is required');
    }
    if (!signature) {
      throw new BadRequestException('Signature is required');
    }
    return this.ordersService.handleStripeWebhook(signature, req.rawBody);
  }

  @Auth(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Auth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.findOne(+id, user.id, user.role);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
