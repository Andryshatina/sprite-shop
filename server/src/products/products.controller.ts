import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { type RequestWithUser } from 'src/auth/types/auth-types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(Role.ADMIN)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Auth()
  @Get('library')
  findPurchasedByUser(@CurrentUser() user: RequestWithUser['user']) {
    return this.productsService.findPurchasedByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
