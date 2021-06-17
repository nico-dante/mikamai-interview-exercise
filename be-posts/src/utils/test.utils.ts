import { Post } from '../posts/post.entity';
import { CategoryDto } from '../categories/categories.dto';
import { CategoriesService } from '../categories/categories.service';
import { MieLogger } from './logging.utils';
import { PostsService } from '../posts/posts.service';

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

export const POST1 = new Post();
POST1.id = 'post-1';
POST1.createdAt = new Date();
POST1.active = true;
POST1.title = 'post one';
POST1.body =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie lacus quam, sit amet volutpat eros eleifend nec. Cras a erat non mauris porta accumsan in quis nisi. Donec orci nisl, condimentum non fermentum ut, accumsan et dui. Vivamus viverra laoreet risus et viverra. Praesent fermentum pretium tristique. Nulla fringilla ultrices ipsum, a sollicitudin nisl. Suspendisse hendrerit dui sem, non auctor justo ullamcorper non. Suspendisse vel turpis mi. Vivamus nec urna justo. Donec in erat metus.';
POST1.categoryId = CATEGORY1.id;

export const POST2 = new Post();
POST2.id = 'post-2';
POST2.createdAt = new Date();
POST2.active = true;
POST2.title = 'post two';
POST2.body =
  'Nullam pellentesque molestie convallis. Ut scelerisque libero at porta sagittis. Nulla ac tortor sed urna lobortis ullamcorper. Sed cursus arcu eget urna ultrices dictum. Mauris mattis quam nisi, sit amet elementum enim posuere eget. Morbi faucibus fermentum tristique. Donec elementum mauris vel sodales lobortis. Integer non dolor in ipsum volutpat dictum sit amet sit amet quam. Quisque ultricies magna nec nulla tempus porta. Morbi vehicula, felis consectetur consequat sagittis, velit dolor pellentesque quam, ac dapibus quam sapien vitae dui. Cras vitae sollicitudin lacus, a mattis turpis. Etiam nec nisl tincidunt nulla dapibus molestie eget eu leo. Ut eu ipsum a est malesuada mollis. Nulla consequat quam quis arcu faucibus, vel efficitur elit gravida.';
POST2.categoryId = CATEGORY2.id;

export let POSTS: Array<Post> = [POST1, POST2];

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

export const mockPostsService = (): PostsService => {
  const postsService = new PostsService(mockLogger(), null);

  jest
    .spyOn(postsService, 'find')
    .mockImplementation(
      async (
        search?: string,
        categoryIds?: Array<string>,
      ): Promise<Array<Post>> => {
        return POSTS.filter(
          (p) =>
            (!search ||
              search.length === 0 ||
              p.title.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
              p.body.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!categoryIds || categoryIds.indexOf(p.categoryId) >= 0),
        );
      },
    );

  jest
    .spyOn(postsService, 'count')
    .mockImplementation(
      async (search?: string, categoryIds?: Array<string>): Promise<number> => {
        return POSTS.filter(
          (p) =>
            (!search ||
              search.length === 0 ||
              p.title.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
              p.body.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
            (!categoryIds || categoryIds.indexOf(p.categoryId) >= 0),
        ).length;
      },
    );

  jest
    .spyOn(postsService, 'add')
    .mockImplementation(
      async (
        title: string,
        body: string,
        categoryId: string,
      ): Promise<Post> => {
        if (
          POSTS.filter((p) => p.title === title && p.categoryId === categoryId)
            .length > 0
        ) {
          throw new Error();
        }

        const post = new Post();
        post.id = 'post-' + new Date().getTime();
        post.createdAt = new Date();
        post.title = title;
        post.body = body;
        post.categoryId = categoryId;

        POSTS.push(post);

        return post;
      },
    );

  jest
    .spyOn(postsService, 'get')
    .mockImplementation(
      async (id: string): Promise<Post> => POSTS.find((p) => p.id === id),
    );

  jest
    .spyOn(postsService, 'update')
    .mockImplementation(
      async (
        id: string,
        title: string,
        body: string,
        categoryId: string,
      ): Promise<Post> => {
        if (
          POSTS.filter(
            (p) =>
              p.id !== id && p.title === title && p.categoryId === categoryId,
          ).length > 0
        ) {
          throw new Error();
        }

        POSTS = POSTS.map((post) => {
          if (post.id === id) {
            post.updatedAt = new Date();
            post.title = title;
            post.body = body;
            post.categoryId = categoryId;
          }

          return post;
        });

        return POSTS.find((p) => p.id === id);
      },
    );

  jest
    .spyOn(postsService, 'delete')
    .mockImplementation(async (id: string, soft = false): Promise<Post> => {
      if (soft) {
        POSTS = POSTS.map((post) => {
          if (post.id === id) {
            post.deletedAt = new Date();
          }

          return post;
        });

        return POSTS.find((p) => p.id === id);
      }

      const p = POSTS.find((p) => p.id === id);

      POSTS.splice(POSTS.indexOf(p));

      return p;
    });

  return postsService;
};
