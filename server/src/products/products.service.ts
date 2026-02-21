import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Product } from '../generated/prisma/client';
import { R2Service } from 'src/r2/r2.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private r2Service: R2Service,
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

  async findPurchasedByUser(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId, status: 'PAID' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const products = orders.flatMap((order) =>
      order.items.map((item) => item.product),
    );
    return products.map((p) => this.mapProduct(p));
  }

  async getDownloadUrl(userId: number, productId: number) {
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: 'PAID',
        },
        productId,
      },
    });
    if (!hasPurchased)
      throw new ForbiddenException('You have not purchased this product');
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (!product.isPublished)
      throw new ForbiddenException('Product not published');

    const downloadUrl = await this.r2Service.getPresignedDownloadUrl(
      product.fileKey,
    );
    return { url: downloadUrl };
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
