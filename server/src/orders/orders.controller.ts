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
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { type RequestWithUser } from 'src/auth/types/auth-types';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new order' })
  @Auth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.create(user.id, createOrderDto.productIds);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a Stripe checkout session for an order' })
  @Auth()
  @Post(':id/checkout')
  @HttpCode(HttpStatus.CREATED)
  createCheckoutSession(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.createCheckoutSession(user.id, id);
  }

  @ApiOperation({ summary: 'Stripe webhook handler (internal use only)' })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @Auth(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @Auth()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.findOne(id, user.id, user.role);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an order (Admin only)' })
  @Auth(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
