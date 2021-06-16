import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MieLoggerModule } from '../utils/logging.utils';
import { Post } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), MieLoggerModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
