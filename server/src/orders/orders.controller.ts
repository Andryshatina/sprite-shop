import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { type RequestWithUser } from 'src/auth/types/auth-types';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth()
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.create(user.id, createOrderDto.productIds);
  }

  @Auth()
  @Post(':id/checkout')
  createCheckoutSession(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.createCheckoutSession(user.id, +id);
  }

  @Auth()
  @Post(':id/verify')
  verifyPayment(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.ordersService.verifyPayment(user.id, id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
