import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MieLoggerModule } from './utils/logging.utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MieLoggerModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
