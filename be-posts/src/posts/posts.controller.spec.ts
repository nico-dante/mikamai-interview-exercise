import { Test, TestingModule } from '@nestjs/testing';
import { MieLoggerModule } from '../utils/logging.utils';
import { postsRepositoryMock } from '../utils/test.utils';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [PostsController],
      providers: [PostsService, postsRepositoryMock],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
