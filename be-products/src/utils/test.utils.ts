import { Product } from '../products/product.entity';
import { FindConditions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const PRODUCT1 = new Product();
PRODUCT1.id = 'product-1';
PRODUCT1.createdAt = new Date();
PRODUCT1.active = true;
PRODUCT1.name = 'product one';
PRODUCT1.price = 3.5;

export const PRODUCTS: Array<Product> = [PRODUCT1];

const mockProductsRepository = new Repository<Product>();

jest
  .spyOn(mockProductsRepository, 'find')
  .mockImplementation(async (conditions?: FindConditions<Product>) =>
    !conditions || !conditions.name
      ? PRODUCTS
      : PRODUCTS.filter(
          (c) =>
            c.name
              .toLowerCase()
              .indexOf(conditions.name.toString().toLowerCase()) >= 0,
        ),
  );

jest
  .spyOn(mockProductsRepository, 'findOne')
  .mockImplementation(async (conditions?: FindConditions<Product>) =>
    PRODUCTS.find((c) => c.id === conditions['id']),
  );

export const productsRepositoryMock = {
  provide: getRepositoryToken(Product),
  useValue: mockProductsRepository,
};
