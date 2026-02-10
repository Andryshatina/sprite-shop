import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Product } from '../generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private mapProduct(product: Product) {
    const publicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');
    return {
      ...product,
      imageUrl: `${publicUrl}/${product.imageKey}`,
    };
  }

  create(userId: number, createProductDto: CreateProductDto) {
    const product = this.prisma.product.create({
      data: {
        ...createProductDto,
        isPublished: true,
        authorId: userId,
      },
    });
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    if (!products) {
      throw new NotFoundException(`Products not found`);
    }
    return products.map((p) => this.mapProduct(p));
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.mapProduct(product);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
