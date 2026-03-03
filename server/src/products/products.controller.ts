import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { type RequestWithUser } from 'src/auth/types/auth-types';
import { PaginateProductsDto } from './dto/paginate-products.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @Auth(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.productsService.create(user.id, createProductDto);
  }

  @ApiOperation({ summary: 'Get all published products (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @Get()
  findAll(@Query() { page, limit }: PaginateProductsDto) {
    return this.productsService.findAll(page, limit);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get products purchased by the current user' })
  @Auth()
  @Get('library')
  findPurchasedByUser(@CurrentUser() user: RequestWithUser['user']) {
    return this.productsService.findPurchasedByUser(user.id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get presigned download URL for a purchased product',
  })
  @Auth()
  @Get(':id/download')
  getDownloadUrl(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestWithUser['user'],
  ) {
    return this.productsService.getDownloadUrl(user.id, id);
  }

  @ApiOperation({ summary: 'Get a single product by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @Auth(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a product and its R2 files (Admin only)' })
  @Auth(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
