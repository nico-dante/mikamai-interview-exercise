import { Test, TestingModule } from '@nestjs/testing';
import {
  CATEGORIES,
  CATEGORY1,
  CATEGORY3,
  mockCategoriesService,
  mockPostsService,
  POSTS,
} from '../utils/test.utils';
import { MieLoggerModule } from '../utils/logging.utils';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from '../categories/categories.service';
import { PostDto } from './posts.dto';

describe('PostsController', () => {
  let controller: PostsController;
  const postDtoList: Array<PostDto> = POSTS.map((p) =>
    PostDto.fromEntity(p, CATEGORIES.find((c) => c.id === p.categoryId).name),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useFactory: mockPostsService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find posts', async () => {
    expect(await controller.find()).toEqual(postDtoList);

    expect(await controller.count(null, CATEGORY1.id)).toEqual(1);

    expect(await controller.get(postDtoList[0].id)).toEqual(postDtoList[0]);
  });

  it('should not find posts', async () => {
    expect(await controller.find('test')).toEqual([]);

    expect(await controller.count(null, CATEGORY3.id)).toEqual(0);

    expect(await controller.get('test')).toBeNull();
  });

  it('should works as a CRUD', async () => {
    expect(await controller.count()).toEqual(postDtoList.length);

    let post = await controller.add({
      title: 'test post one',
      body: 'body of post one',
      categoryId: CATEGORY3.id,
    });

    expect(post).toBeDefined();

    expect(await controller.count()).toEqual(postDtoList.length + 1);

    expect(await controller.get(post.id)).toEqual(post);

    post = await controller.update(post.id, {
      title: post.title,
      body: 'new body',
      categoryId: CATEGORY3.id,
    });

    expect(post.body).toEqual('new body');

    await controller.delete(post.id);

    expect(await controller.count()).toEqual(postDtoList.length);

    expect(await controller.get(post.id)).toBeNull();
  });

  it('should get error', async () => {
    let error: Error;
    try {
      await controller.add({
        title: 'test post one',
        body: 'body of post one',
        categoryId: 'non-existent category id',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
  });
});
