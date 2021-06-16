import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { MieLoggerModule } from '../utils/logging.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), MieLoggerModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
