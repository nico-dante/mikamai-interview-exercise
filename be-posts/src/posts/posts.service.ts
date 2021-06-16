import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MieLogger } from '../utils/logging.utils';
import { FindConditions, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    private logger: MieLogger,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {
    logger.setContext(PostsService.name);
  }

  async find(
    search?: string,
    categoryIds?: Array<string>,
  ): Promise<Array<Post>> {
    return this.postsRepository.find({
      where: this.findConditions(search, categoryIds),
    });
  }

  async count(search?: string, categoryIds?: Array<string>): Promise<number> {
    return this.postsRepository.count({
      where: this.findConditions(search, categoryIds),
    });
  }

  async add(title: string, body: string, categoryId: string): Promise<Post> {
    const countByName = await this.postsRepository.count({
      where: {
        deletedAt: IsNull(),
        title: title,
        categoryId: categoryId,
      },
    });

    if (countByName > 0) {
      throw new Error(
        `there is another category with title "${title}" and category id "${categoryId}"`,
      );
    }

    let post = new Post();
    post.title = title;
    post.body = body;
    post.categoryId = categoryId;

    post = await this.postsRepository.save(post);

    return this.get(post.id);
  }

  async get(id: string): Promise<Post> {
    return this.postsRepository.findOne({
      where: { id: id },
    });
  }

  async update(
    id: string,
    title: string,
    body: string,
    categoryId: string,
  ): Promise<Post> {
    const countByName = await this.postsRepository.count({
      where: {
        deletedAt: IsNull(),
        title: title,
        categoryId: categoryId,
        id: Not(id),
      },
    });

    if (countByName > 0) {
      throw new Error(
        `there is another category with title "${title}" and category id "${categoryId}"`,
      );
    }

    let post = await this.postsRepository.findOneOrFail(id);
    post.title = title;
    post.body = body;
    post.categoryId = categoryId;

    post = await this.postsRepository.save(post);

    return this.get(post.id);
  }

  async delete(id: string, soft = false): Promise<Post> {
    const post = await this.postsRepository.findOneOrFail({
      where: { id: id },
    });

    if (soft) {
      post.deletedAt = new Date();
      return this.postsRepository.save(post);
    }

    return this.postsRepository.remove(post);
  }

  private findConditions(
    search?: string,
    categoryIds?: Array<string>,
  ): FindConditions<Post> | Array<FindConditions<Post>> {
    let findConditions: FindConditions<Post> | Array<FindConditions<Post>> = {
      deletedAt: IsNull(),
    };

    if (search && search.length > 0) {
      findConditions = [
        {
          deletedAt: IsNull(),
          title: ILike(`%${search}%`),
        },
        {
          deletedAt: IsNull(),
          body: ILike(`%${search}%`),
        },
      ];
    }

    if (categoryIds) {
      if (!Array.isArray(findConditions)) {
        findConditions.categoryId = In(categoryIds);
      } else {
        findConditions = findConditions.map((fc) => ({
          ...fc,
          categoryId: In(categoryIds),
        }));
      }
    }

    return findConditions;
  }
}
