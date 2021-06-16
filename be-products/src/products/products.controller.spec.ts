import { Test, TestingModule } from '@nestjs/testing';
import { MieLoggerModule } from '../utils/logging.utils';
import { productsRepositoryMock } from '../utils/test.utils';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      controllers: [ProductsController],
      providers: [ProductsService, productsRepositoryMock],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
