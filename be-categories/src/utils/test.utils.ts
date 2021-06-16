import { Category } from '../categories/category.entity';
import { FindConditions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const CATEGORY1 = new Category();
CATEGORY1.id = 'category-1';
CATEGORY1.createdAt = new Date();
CATEGORY1.active = true;
CATEGORY1.name = 'category one';

export const CATEGORY2 = new Category();
CATEGORY2.id = 'category-2';
CATEGORY2.createdAt = new Date();
CATEGORY2.active = true;
CATEGORY2.name = 'category two';

export const CATEGORY3 = new Category();
CATEGORY3.id = 'category-3';
CATEGORY3.createdAt = new Date();
CATEGORY3.active = true;
CATEGORY3.name = 'category three';

export const CATEGORIES: Array<Category> = [CATEGORY1, CATEGORY2, CATEGORY3];

const mockCategoriesRepository = new Repository<Category>();

jest
  .spyOn(mockCategoriesRepository, 'find')
  .mockImplementation(async (conditions?: FindConditions<Category>) =>
    !conditions || !conditions.name
      ? CATEGORIES
      : CATEGORIES.filter(
          (c) =>
            c.name
              .toLowerCase()
              .indexOf(conditions.name.toString().toLowerCase()) >= 0,
        ),
  );

jest
  .spyOn(mockCategoriesRepository, 'findOne')
  .mockImplementation(async (conditions?: FindConditions<Category>) =>
    CATEGORIES.find((c) => c.id === conditions['id']),
  );

export const categoriesRepositoryMock = {
  provide: getRepositoryToken(Category),
  useValue: mockCategoriesRepository,
};
