import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MieLoggerModule } from '../utils/logging.utils';
import { Post } from './post.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MieLoggerModule,
    CategoriesModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
