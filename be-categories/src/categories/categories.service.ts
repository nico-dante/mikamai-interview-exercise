import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, ILike, IsNull, Not, Repository } from 'typeorm';
import { MieLogger } from '../utils/logging.utils';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private logger: MieLogger,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    logger.setContext(CategoriesService.name);
  }

  async find(search?: string): Promise<Array<Category>> {
    const findConditions: FindConditions<Category> = {
      deletedAt: IsNull(),
    };

    if (search && search.length > 0) {
      findConditions.name = ILike(`%${search}%`);
    }

    return this.categoriesRepository.find({
      where: findConditions,
    });
  }

  async add(name: string): Promise<Category> {
    const countByName = await this.categoriesRepository.count({
      where: {
        deletedAt: IsNull(),
        name: name,
      },
    });

    if (countByName > 0) {
      throw new Error(`there is another category with name "${name}"`);
    }

    let category = new Category();
    category.name = name;

    category = await this.categoriesRepository.save(category);

    return this.get(category.id);
  }

  async get(id: string): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: string, name: string): Promise<Category> {
    const countByName = await this.categoriesRepository.count({
      where: {
        deletedAt: IsNull(),
        name: name,
        id: Not(id),
      },
    });

    if (countByName > 0) {
      throw new Error(`there is another category with name "${name}"`);
    }

    let category = await this.categoriesRepository.findOneOrFail(id);
    category.name = name;

    category = await this.categoriesRepository.save(category);

    return this.get(category.id);
  }

  async delete(id: string, soft = false): Promise<Category> {
    const category = await this.categoriesRepository.findOneOrFail({
      where: { id: id },
    });

    //if (
    //  (category.posts && category.posts.length > 0) ||
    //  (category.posts && category.posts.length > 0)
    //) {
    //  throw new Error('');
    //}

    if (soft) {
      category.deletedAt = new Date();
      return this.categoriesRepository.save(category);
    }

    return this.categoriesRepository.remove(category);
  }
}
