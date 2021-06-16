import { Test, TestingModule } from '@nestjs/testing';
import { MieLoggerModule } from '../utils/logging.utils';
import { productsRepositoryMock } from '../utils/test.utils';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MieLoggerModule],
      providers: [ProductsService, productsRepositoryMock],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
