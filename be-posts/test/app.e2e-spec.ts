import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  CATEGORIES,
  mockCategoriesService,
  mockPostsService,
  POSTS,
} from '../src/utils/test.utils';
import { PostDto } from '../src/posts/posts.dto';
import { MieLoggerModule } from '../src/utils/logging.utils';
import { PostsController } from '../src/posts/posts.controller';
import { PostsService } from '../src/posts/posts.service';
import { CategoriesService } from '../src/categories/categories.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const postDtoList: Array<PostDto> = POSTS.map((p) =>
    PostDto.fromEntity(
      p,
      CATEGORIES.find((c) => c.id === p.categoryId),
    ),
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useFactory: mockPostsService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect(JSON.stringify(postDtoList));
  });
});
