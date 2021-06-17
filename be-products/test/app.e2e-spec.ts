import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MieLoggerModule } from '../src/utils/logging.utils';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { CategoriesService } from '../src/categories/categories.service';
import {
  CATEGORIES,
  mockCategoriesService,
  mockProductsService,
  PRODUCTS,
} from '../src/utils/test.utils';
import { ProductDto } from '../src/products/products.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const productDtoList: Array<ProductDto> = PRODUCTS.map((p) =>
    ProductDto.fromEntity(
      p,
      CATEGORIES.find((c) => c.id === p.categoryId),
    ),
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useFactory: mockProductsService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(JSON.stringify(productDtoList));
  });
});
