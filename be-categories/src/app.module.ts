import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MieLoggerModule } from './utils/logging.utils';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), MieLoggerModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
