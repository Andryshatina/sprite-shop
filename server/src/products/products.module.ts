import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { R2Service } from 'src/r2/r2.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, R2Service],
})
export class ProductsModule {}
