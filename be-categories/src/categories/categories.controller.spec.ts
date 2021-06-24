import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts/posts.service';
import { ProductsService } from '../products/products.service';
import {
  CATEGORIES,
  CATEGORY1,
  mockCategoriesService,
  mockPostsService,
  mockProductsService,
  POSTS,
  PRODUCTS,
} from '../utils/test.utils';
import { MieLoggerModule } from '../utils/logging.utils';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './categories.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const categoryDtoList: Array<CategoryDto> = CATEGORIES.map((c) =>
    CategoryDto.fromEntity(
      c,
      POSTS.filter((p) => p.category.id === c.id).length,
      PRODUCTS.filter((p) => p.category.id === c.id).length,
    ),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useFactory: mockCategoriesService },
        { provide: ProductsService, useFactory: mockProductsService },
        { provide: PostsService, useFactory: mockPostsService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find categories', async () => {
    expect(await controller.find()).toEqual(categoryDtoList);

    expect(await controller.find(categoryDtoList[0].name)).toEqual([
      categoryDtoList[0],
    ]);

    expect(await controller.count(null, CATEGORY1.id)).toEqual(1);

    expect(
      await controller.count(
        null,
        CATEGORIES.map((c) => c.id),
      ),
    ).toEqual(CATEGORIES.length);

    expect(await controller.get(categoryDtoList[0].id)).toEqual(
      categoryDtoList[0],
    );
  });

  it('should not find categories', async () => {
    expect(await controller.find('test')).toEqual([]);

    expect(await controller.count(null, 'non-existent category id')).toEqual(0);

    expect(await controller.get('test')).toBeNull();
  });

  it('should works as a CRUD', async () => {
    expect(await controller.count()).toEqual(categoryDtoList.length);

    let category = await controller.add({
      name: 'test category one',
    });

    expect(category).toBeDefined();

    expect(await controller.count()).toEqual(categoryDtoList.length + 1);

    expect(await controller.get(category.id)).toEqual(category);

    category = await controller.update(category.id, {
      name: 'test category one modified',
    });

    expect(category.name).toEqual('test category one modified');

    await controller.delete(category.id);

    expect(await controller.count()).toEqual(categoryDtoList.length);

    expect(await controller.get(category.id)).toBeNull();
  });

  it('should get error', async () => {
    expect(controller.delete(CATEGORY1.id)).rejects.toThrowError(
      `prodcuts referenced by category with id ${CATEGORY1.id}`,
    );
  });
});
