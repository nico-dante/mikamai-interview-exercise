import { Post } from '../posts/post.entity';
import { FindConditions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export const POST1 = new Post();
POST1.id = 'post-1';
POST1.createdAt = new Date();
POST1.active = true;
POST1.title = 'post one';
POST1.body =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie lacus quam, sit amet volutpat eros eleifend nec. Cras a erat non mauris porta accumsan in quis nisi. Donec orci nisl, condimentum non fermentum ut, accumsan et dui. Vivamus viverra laoreet risus et viverra. Praesent fermentum pretium tristique. Nulla fringilla ultrices ipsum, a sollicitudin nisl. Suspendisse hendrerit dui sem, non auctor justo ullamcorper non. Suspendisse vel turpis mi. Vivamus nec urna justo. Donec in erat metus.';

export const POST2 = new Post();
POST2.id = 'post-2';
POST2.createdAt = new Date();
POST2.active = true;
POST2.title = 'post two';
POST2.body =
  'Nullam pellentesque molestie convallis. Ut scelerisque libero at porta sagittis. Nulla ac tortor sed urna lobortis ullamcorper. Sed cursus arcu eget urna ultrices dictum. Mauris mattis quam nisi, sit amet elementum enim posuere eget. Morbi faucibus fermentum tristique. Donec elementum mauris vel sodales lobortis. Integer non dolor in ipsum volutpat dictum sit amet sit amet quam. Quisque ultricies magna nec nulla tempus porta. Morbi vehicula, felis consectetur consequat sagittis, velit dolor pellentesque quam, ac dapibus quam sapien vitae dui. Cras vitae sollicitudin lacus, a mattis turpis. Etiam nec nisl tincidunt nulla dapibus molestie eget eu leo. Ut eu ipsum a est malesuada mollis. Nulla consequat quam quis arcu faucibus, vel efficitur elit gravida.';

export const POSTS: Array<Post> = [POST1, POST2];

const mockPostsRepository = new Repository<Post>();

jest
  .spyOn(mockPostsRepository, 'find')
  .mockImplementation(async (conditions?: FindConditions<Post>) =>
    !conditions || !conditions.title
      ? POSTS
      : POSTS.filter(
          (c) =>
            c.title
              .toLowerCase()
              .indexOf(conditions.title.toString().toLowerCase()) >= 0,
        ),
  );

jest
  .spyOn(mockPostsRepository, 'findOne')
  .mockImplementation(async (conditions?: FindConditions<Post>) =>
    POSTS.find((c) => c.id === conditions['id']),
  );

export const postsRepositoryMock = {
  provide: getRepositoryToken(Post),
  useValue: mockPostsRepository,
};
