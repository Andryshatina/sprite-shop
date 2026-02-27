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
  private readonly publicUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private r2Service: R2Service,
  ) {
    this.publicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');
  }

  private mapProduct(product: Product) {
    return {
      ...product,
      imageUrl: `${this.publicUrl}/${product.imageKey}`,
    };
  }

  async create(userId: number, createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        isPublished: true,
        authorId: userId,
      },
    });
    return this.mapProduct(product);
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      where: { isPublished: true },
    });
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
    const items = await this.prisma.orderItem.findMany({
      where: { order: { userId, status: 'PAID' } },
      include: { product: true },
      distinct: ['productId'],
    });
    return items.map((item) => this.mapProduct(item.product));
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return this.mapProduct(product);
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    await Promise.all<void>([
      this.r2Service.deleteFile(product.imageKey, false),
      this.r2Service.deleteFile(product.fileKey, true),
    ]);

    return this.prisma.product.delete({ where: { id } });
  }
}
