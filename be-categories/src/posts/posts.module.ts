import { HttpModule, Module } from '@nestjs/common';
import { MieLoggerModule } from '../utils/logging.utils';
import { PostsService } from './posts.service';

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
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
