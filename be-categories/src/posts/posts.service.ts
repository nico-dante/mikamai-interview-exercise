import { HttpService, Injectable } from '@nestjs/common';
import { MieLogger } from '../utils/logging.utils';
import { PostDto } from './posts.dto';

const POSTS_URL = `http://${process.env.POSTS_HOST}:${process.env.POSTS_PORT}/posts/`;

@Injectable()
export class PostsService {
  constructor(private logger: MieLogger, private httpService: HttpService) {}

  async count(categoryIds: Array<string>): Promise<number> {
    if (categoryIds.length === 0) {
      return 0;
    }

    let idList = '';
    categoryIds.forEach((id) => {
      idList += (idList.length === 0 ? '?categoryId=' : '&categoryId=') + id;
    });

    return (
      await this.httpService
        .get<number>(POSTS_URL + `count/${idList}`)
        .toPromise()
    ).data;
  }

  async countList(
    categoryIds: Array<string>,
  ): Promise<{ [categoryId: string]: number }> {
    const catIdPostCountMap: { [categoryId: string]: number } = {};

    if (categoryIds.length > 0) {
      let idList = '';
      categoryIds.forEach((id) => {
        idList += (idList.length === 0 ? '?categoryId=' : '&categoryId=') + id;

        catIdPostCountMap[id] = 0;
      });

      const posts = (
        await this.httpService
          .get<Array<PostDto>>(POSTS_URL + `${idList}`)
          .toPromise()
      ).data;

      posts.forEach((p) => {
        catIdPostCountMap[p.category.id]++;
      });
    }

    return catIdPostCountMap;
  }
}
