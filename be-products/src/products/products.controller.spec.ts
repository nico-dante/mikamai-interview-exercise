import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import {
  CATEGORIES,
  CATEGORY1,
  CATEGORY2,
  CATEGORY3,
  mockCategoriesService,
  mockProductsService,
  PRODUCTS,
} from '../utils/test.utils';
import { MieLoggerModule } from '../utils/logging.utils';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductDto } from './products.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  const productDtoList: Array<ProductDto> = PRODUCTS.map((p) =>
    ProductDto.fromEntity(
      p,
      CATEGORIES.find((c) => c.id === p.categoryId),
    ),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useFactory: mockProductsService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find products', async () => {
    expect(await controller.find()).toEqual(productDtoList);

    expect(await controller.count(null, CATEGORY1.id)).toEqual(1);

    expect(await controller.get(productDtoList[0].id)).toEqual(
      productDtoList[0],
    );
  });

  it('should not find products', async () => {
    expect(await controller.find('test')).toEqual([]);

    expect(await controller.count(null, CATEGORY2.id)).toEqual(0);

    expect(await controller.get('test')).toBeNull();
  });

  it('should works as a CRUD', async () => {
    expect(await controller.count()).toEqual(productDtoList.length);

    let product = await controller.add({
      name: 'test product one',
      price: 42.6,
      categoryId: CATEGORY3.id,
    });

    expect(product).toBeDefined();

    expect(await controller.count()).toEqual(productDtoList.length + 1);

    expect(await controller.get(product.id)).toEqual(product);

    product = await controller.update(product.id, {
      name: product.name,
      price: 33,
      categoryId: CATEGORY3.id,
    });

    expect(product.price).toEqual(33);

    await controller.delete(product.id);

    expect(await controller.count()).toEqual(productDtoList.length);

    expect(await controller.get(product.id)).toBeNull();
  });

  it('should get error', async () => {
    expect(
      controller.add({
        name: 'test product one',
        price: 42,
        categoryId: 'non-existent category id',
      }),
    ).rejects.toThrowError(
      `category with id non-existent category id not found`,
    );
  });
});
