import { HttpService, Injectable } from '@nestjs/common';
import { MieLogger } from '../utils/logging.utils';
import { ProductDto } from './products.dto';

const PRODUCTS_URL = `http://${process.env.PRODUCTS_HOST}:${process.env.PRODUCTS_PORT}/products/`;

@Injectable()
export class ProductsService {
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
        .get<number>(PRODUCTS_URL + `count/${idList}`)
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
          .get<Array<ProductDto>>(PRODUCTS_URL + `${idList}`)
          .toPromise()
      ).data;

      posts.forEach((p) => {
        catIdPostCountMap[p.categoryId]++;
      });
    }

    return catIdPostCountMap;
  }
}
