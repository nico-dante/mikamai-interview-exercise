import { Test, TestingModule } from '@nestjs/testing';
import { MieLoggerModule } from '../utils/logging.utils';
import { postsRepositoryMock } from '../utils/test.utils';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      providers: [PostsService, postsRepositoryMock],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
