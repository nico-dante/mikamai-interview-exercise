import { Product } from '../products/product.entity';
import { CategoryDto } from '../categories/categories.dto';
import { CategoriesService } from '../categories/categories.service';
import { MieLogger } from './logging.utils';
import { ProductsService } from '../products/products.service';

export const CATEGORY1 = new CategoryDto();
CATEGORY1.id = 'category-1';
CATEGORY1.name = 'category one';

export const CATEGORY2 = new CategoryDto();
CATEGORY2.id = 'category-2';
CATEGORY2.name = 'category two';

export const CATEGORY3 = new CategoryDto();
CATEGORY3.id = 'category-3';
CATEGORY3.name = 'category three';

export const CATEGORIES: Array<CategoryDto> = [CATEGORY1, CATEGORY2, CATEGORY3];

export const PRODUCT1 = new Product();
PRODUCT1.id = 'product-1';
PRODUCT1.createdAt = new Date();
PRODUCT1.active = true;
PRODUCT1.name = 'product one';
PRODUCT1.price = 3.5;
PRODUCT1.categoryId = CATEGORY1.id;

export let PRODUCTS: Array<Product> = [PRODUCT1];

export const mockLogger = (): MieLogger => new MieLogger(null);

export const mockCategoriesService = (): CategoriesService => {
  const categoriesService = new CategoriesService(mockLogger(), null);

  jest
    .spyOn(categoriesService, 'list')
    .mockImplementation(
      async (ids: Array<string>): Promise<Array<CategoryDto>> => {
        if (ids.length === 0) {
          return [];
        }

        return CATEGORIES.filter((c) => ids.indexOf(c.id) >= 0);
      },
    );

  jest
    .spyOn(categoriesService, 'get')
    .mockImplementation(
      async (id: string): Promise<CategoryDto> =>
        CATEGORIES.find((c) => c.id === id),
    );

  return categoriesService;
};

export const mockProductsService = (): ProductsService => {
  const productsService = new ProductsService(mockLogger(), null);

  jest
    .spyOn(productsService, 'find')
    .mockImplementation(
      async (
        search?: string,
        categoryIds?: Array<string>,
      ): Promise<Array<Product>> => {
        return PRODUCTS.filter(
          (p) =>
            (!search ||
              search.length === 0 ||
              p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!categoryIds || categoryIds.indexOf(p.categoryId) >= 0),
        );
      },
    );

  jest
    .spyOn(productsService, 'count')
    .mockImplementation(
      async (search?: string, categoryIds?: Array<string>): Promise<number> => {
        return PRODUCTS.filter(
          (p) =>
            (!search ||
              search.length === 0 ||
              p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!categoryIds || categoryIds.indexOf(p.categoryId) >= 0),
        ).length;
      },
    );

  jest
    .spyOn(productsService, 'add')
    .mockImplementation(
      async (
        name: string,
        price: number,
        categoryId: string,
      ): Promise<Product> => {
        if (
          PRODUCTS.filter((p) => p.name === name && p.categoryId === categoryId)
            .length > 0
        ) {
          throw new Error();
        }

        const product = new Product();
        product.id = 'product-' + new Date().getTime();
        product.createdAt = new Date();
        product.name = name;
        product.price = price;
        product.categoryId = categoryId;

        PRODUCTS.push(product);

        return product;
      },
    );

  jest
    .spyOn(productsService, 'get')
    .mockImplementation(
      async (id: string): Promise<Product> => PRODUCTS.find((c) => c.id === id),
    );

  jest
    .spyOn(productsService, 'update')
    .mockImplementation(
      async (
        id: string,
        name: string,
        price: number,
        categoryId: string,
      ): Promise<Product> => {
        if (
          PRODUCTS.filter(
            (p) =>
              p.id !== id && p.name === name && p.categoryId === categoryId,
          ).length > 0
        ) {
          throw new Error();
        }

        PRODUCTS = PRODUCTS.map((product) => {
          if (product.id === id) {
            product.updatedAt = new Date();
            product.name = name;
            product.price = price;
            product.categoryId = categoryId;
          }

          return product;
        });

        return PRODUCTS.find((p) => p.id === id);
      },
    );

  jest
    .spyOn(productsService, 'delete')
    .mockImplementation(async (id: string, soft = false): Promise<Product> => {
      if (soft) {
        PRODUCTS = PRODUCTS.map((product) => {
          if (product.id === id) {
            product.deletedAt = new Date();
          }

          return product;
        });

        return PRODUCTS.find((p) => p.id === id);
      }

      const p = PRODUCTS.find((p) => p.id === id);

      PRODUCTS.splice(PRODUCTS.indexOf(p));

      return p;
    });

  return productsService;
};
