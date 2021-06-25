import { PostDto } from '../posts/posts.dto';
import { ProductDto } from '../products/products.dto';
import { Category } from '../categories/category.entity';
import { MieLogger } from './logging.utils';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';
import { PostsService } from '../posts/posts.service';
import { CategoryDto } from '../categories/categories.dto';

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

export let CATEGORIES: Array<Category> = [CATEGORY1, CATEGORY2, CATEGORY3];

export const POST1 = new PostDto();
POST1.id = 'post-1';
POST1.title = 'post one';
POST1.body =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie lacus quam, sit amet volutpat eros eleifend nec. Cras a erat non mauris porta accumsan in quis nisi. Donec orci nisl, condimentum non fermentum ut, accumsan et dui. Vivamus viverra laoreet risus et viverra. Praesent fermentum pretium tristique. Nulla fringilla ultrices ipsum, a sollicitudin nisl. Suspendisse hendrerit dui sem, non auctor justo ullamcorper non. Suspendisse vel turpis mi. Vivamus nec urna justo. Donec in erat metus.';
POST1.category = CategoryDto.fromEntity(CATEGORY1, 0, 0);

export const POST2 = new PostDto();
POST2.id = 'post-2';
POST2.title = 'post two';
POST2.body =
  'Nullam pellentesque molestie convallis. Ut scelerisque libero at porta sagittis. Nulla ac tortor sed urna lobortis ullamcorper. Sed cursus arcu eget urna ultrices dictum. Mauris mattis quam nisi, sit amet elementum enim posuere eget. Morbi faucibus fermentum tristique. Donec elementum mauris vel sodales lobortis. Integer non dolor in ipsum volutpat dictum sit amet sit amet quam. Quisque ultricies magna nec nulla tempus porta. Morbi vehicula, felis consectetur consequat sagittis, velit dolor pellentesque quam, ac dapibus quam sapien vitae dui. Cras vitae sollicitudin lacus, a mattis turpis. Etiam nec nisl tincidunt nulla dapibus molestie eget eu leo. Ut eu ipsum a est malesuada mollis. Nulla consequat quam quis arcu faucibus, vel efficitur elit gravida.';
POST2.category = CategoryDto.fromEntity(CATEGORY2, 0, 0);

export const POSTS: Array<PostDto> = [POST1, POST2];

export const PRODUCT1 = new ProductDto();
PRODUCT1.id = 'product-1';
PRODUCT1.name = 'product one';
PRODUCT1.price = 3.5;
PRODUCT1.category = CategoryDto.fromEntity(CATEGORY1, 0, 0);

export const PRODUCTS: Array<ProductDto> = [PRODUCT1];

export const CATEGORY_DTOS: Array<CategoryDto> = CATEGORIES.map((c) =>
  CategoryDto.fromEntity(
    c,
    POSTS.filter((p) => p.category.id === c.id).length,
    PRODUCTS.filter((p) => p.category.id === c.id).length,
  ),
);

export const mockLogger = (): MieLogger => new MieLogger(null);

export const mockProductsService = (): ProductsService => {
  const productsService = new ProductsService(mockLogger(), null);

  jest
    .spyOn(productsService, 'count')
    .mockImplementation(
      async (categoryIds?: Array<string>): Promise<number> =>
        PRODUCTS.filter((p) => categoryIds.indexOf(p.category.id) >= 0).length,
    );

  jest
    .spyOn(productsService, 'countList')
    .mockImplementation(
      async (
        categoryIds?: Array<string>,
      ): Promise<{ [categoryId: string]: number }> => {
        const catIdProductCountMap: { [categoryId: string]: number } = {};

        if (categoryIds.length > 0) {
          categoryIds.forEach((id) => {
            catIdProductCountMap[id] = 0;
          });

          PRODUCTS.forEach((p) => {
            catIdProductCountMap[p.category.id]++;
          });
        }

        return catIdProductCountMap;
      },
    );

  return productsService;
};

export const mockPostsService = (): PostsService => {
  const postsService = new PostsService(mockLogger(), null);

  jest
    .spyOn(postsService, 'count')
    .mockImplementation(
      async (categoryIds?: Array<string>): Promise<number> =>
        POSTS.filter((p) => categoryIds.indexOf(p.category.id) >= 0).length,
    );

  jest
    .spyOn(postsService, 'countList')
    .mockImplementation(
      async (
        categoryIds?: Array<string>,
      ): Promise<{ [categoryId: string]: number }> => {
        const catIdPostCountMap: { [categoryId: string]: number } = {};

        if (categoryIds.length > 0) {
          categoryIds.forEach((id) => {
            catIdPostCountMap[id] = 0;
          });

          POSTS.forEach((p) => {
            catIdPostCountMap[p.category.id]++;
          });
        }

        return catIdPostCountMap;
      },
    );

  return postsService;
};

export const mockCategoriesService = (): CategoriesService => {
  const categoriesService = new CategoriesService(mockLogger(), null);

  jest
    .spyOn(categoriesService, 'find')
    .mockImplementation(
      async (
        search?: string,
        ids?: Array<string>,
      ): Promise<Array<Category>> => {
        return CATEGORIES.filter(
          (c) =>
            (!search ||
              search.length === 0 ||
              c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!ids || ids.indexOf(c.id) >= 0),
        );
      },
    );

  jest
    .spyOn(categoriesService, 'count')
    .mockImplementation(
      async (search?: string, ids?: Array<string>): Promise<number> => {
        return CATEGORIES.filter(
          (c) =>
            (!search ||
              search.length === 0 ||
              c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!ids || ids.indexOf(c.id) >= 0),
        ).length;
      },
    );

  jest
    .spyOn(categoriesService, 'add')
    .mockImplementation(async (name: string): Promise<Category> => {
      if (CATEGORIES.filter((c) => c.name === name).length > 0) {
        throw new Error();
      }

      const category = new Category();
      category.id = 'category-' + new Date().getTime();
      category.createdAt = new Date();
      category.name = name;

      CATEGORIES.push(category);

      return category;
    });

  jest
    .spyOn(categoriesService, 'get')
    .mockImplementation(
      async (id: string): Promise<Category> =>
        CATEGORIES.find((c) => c.id === id),
    );

  jest
    .spyOn(categoriesService, 'update')
    .mockImplementation(async (id: string, name: string): Promise<Category> => {
      if (CATEGORIES.filter((p) => p.id !== id && p.name === name).length > 0) {
        throw new Error();
      }

      CATEGORIES = CATEGORIES.map((category) => {
        if (category.id === id) {
          category.updatedAt = new Date();
          category.name = name;
        }

        return category;
      });

      return CATEGORIES.find((p) => p.id === id);
    });

  jest
    .spyOn(categoriesService, 'delete')
    .mockImplementation(async (id: string, soft = false): Promise<Category> => {
      if (soft) {
        CATEGORIES = CATEGORIES.map((category) => {
          if (category.id === id) {
            category.deletedAt = new Date();
          }

          return category;
        });

        return CATEGORIES.find((p) => p.id === id);
      }

      const p = CATEGORIES.find((p) => p.id === id);

      CATEGORIES.splice(CATEGORIES.indexOf(p));

      return p;
    });

  return categoriesService;
};
