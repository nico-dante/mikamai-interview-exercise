import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CategoriesController } from '../src/categories/categories.controller';
import { MieLoggerModule } from '../src/utils/logging.utils';
import { CategoriesService } from '../src/categories/categories.service';
import { PostsService } from '../src/posts/posts.service';
import { ProductsService } from '../src/products/products.service';
import {
  CATEGORY_DTOS,
  mockCategoriesService,
  mockPostsService,
  mockProductsService,
} from '../src/utils/test.utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
      .expect(JSON.stringify(CATEGORY_DTOS));
  });

  it('/:id/ (GET)', () => {
    return request(app.getHttpServer())
      .get(`/categories/${CATEGORY_DTOS[0].id}/`)
      .expect(200)
      .expect(JSON.stringify(CATEGORY_DTOS[0]));
  });
});
