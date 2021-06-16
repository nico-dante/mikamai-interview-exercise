import { Test, TestingModule } from '@nestjs/testing';
import { MieLoggerModule } from '../utils/logging.utils';
import { categoriesRepositoryMock } from '../utils/test.utils';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [CategoriesController],
      providers: [CategoriesService, categoriesRepositoryMock],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
