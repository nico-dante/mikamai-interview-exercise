import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CategoriesController } from '../src/categories/categories.controller';
import { MieLoggerModule } from '../src/utils/logging.utils';
import { CategoriesService } from '../src/categories/categories.service';
import { PostsService } from '../src/posts/posts.service';
import { ProductsService } from '../src/products/products.service';
import {
  CATEGORIES,
  mockCategoriesService,
  mockPostsService,
  mockProductsService,
  POSTS,
  PRODUCTS,
} from '../src/utils/test.utils';
import { CategoryDto } from '../src/categories/categories.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const categoryDtoList: Array<CategoryDto> = CATEGORIES.map((c) =>
    CategoryDto.fromEntity(
      c,
      POSTS.filter((p) => p.category.id === c.id).length,
      PRODUCTS.filter((p) => p.category.id === c.id).length,
    ),
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useFactory: mockCategoriesService },
        { provide: PostsService, useFactory: mockPostsService },
        { provide: ProductsService, useFactory: mockProductsService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(JSON.stringify(categoryDtoList));
  });
});
