import { HttpModule, Module } from '@nestjs/common';
import { MieLoggerModule } from '../utils/logging.utils';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MieLoggerModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
