import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MieLogger } from '../utils/logging.utils';
import { FindConditions, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private logger: MieLogger,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {
    logger.setContext(ProductsService.name);
  }

  async find(
    search?: string,
    categoryIds?: Array<string>,
  ): Promise<Array<Product>> {
    return this.productsRepository.find({
      where: this.findConditions(search, categoryIds),
    });
  }

  async count(search?: string, categoryIds?: Array<string>): Promise<number> {
    return this.productsRepository.count({
      where: this.findConditions(search, categoryIds),
    });
  }

  async add(name: string, price: number, categoryId: string): Promise<Product> {
    const countByName = await this.productsRepository.count({
      where: {
        deletedAt: IsNull(),
        name: name,
        categoryId: categoryId,
      },
    });

    if (countByName > 0) {
      throw new Error(
        `there is another category with name "${name}" and category id "${categoryId}"`,
      );
    }

    let product = new Product();
    product.name = name;
    product.price = price;
    product.categoryId = categoryId;

    product = await this.productsRepository.save(product);

    return this.get(product.id);
  }

  async get(id: string): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: id },
    });
  }

  async update(
    id: string,
    name: string,
    price: number,
    categoryId: string,
  ): Promise<Product> {
    const countByName = await this.productsRepository.count({
      where: {
        deletedAt: IsNull(),
        name: name,
        categoryId: categoryId,
        id: Not(id),
      },
    });

    if (countByName > 0) {
      throw new Error(
        `there is another category with name "${name}" and category id "${categoryId}"`,
      );
    }

    let product = await this.productsRepository.findOneOrFail(id);
    product.name = name;
    product.price = price;
    product.categoryId = categoryId;

    product = await this.productsRepository.save(product);

    return this.get(product.id);
  }

  async delete(id: string, soft = false): Promise<Product> {
    const product = await this.productsRepository.findOneOrFail({
      where: { id: id },
    });

    if (soft) {
      product.deletedAt = new Date();
      return this.productsRepository.save(product);
    }

    return this.productsRepository.remove(product);
  }

  private findConditions(
    search?: string,
    categoryIds?: Array<string>,
  ): FindConditions<Product> {
    const findConditions: FindConditions<Product> = {
      deletedAt: IsNull(),
    };

    if (search && search.length > 0) {
      findConditions.name = ILike(`%${search}%`);
    }

    if (categoryIds) {
      findConditions.categoryId = In(categoryIds);
    }

    return findConditions;
  }
}
