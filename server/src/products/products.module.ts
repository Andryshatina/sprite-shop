import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { R2Module } from 'src/r2/r2.module';

@Module({
  imports: [R2Module],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
