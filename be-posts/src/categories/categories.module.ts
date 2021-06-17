import { HttpModule, Module } from '@nestjs/common';
import { MieLoggerModule } from '../utils/logging.utils';
import { CategoriesService } from './categories.service';

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
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
