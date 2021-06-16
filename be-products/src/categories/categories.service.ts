import { HttpService, Injectable } from '@nestjs/common';
import { MieLogger } from '../utils/logging.utils';
import { CategoryDto } from './categories.dto';

const CATEGORIES_URL = `http://${process.env.CATEGORIES_HOST}:${process.env.CATEGORIES_PORT}/categories/`;

@Injectable()
export class CategoriesService {
  constructor(private logger: MieLogger, private httpService: HttpService) {}

  async list(ids: Array<string>): Promise<Array<CategoryDto>> {
    if (ids.length === 0) {
      return [];
    }

    let idList = '';
    ids.forEach((id) => {
      idList += (idList.length === 0 ? '?id=' : '&id=') + id;
    });

    return (
      await this.httpService
        .get<Array<CategoryDto>>(CATEGORIES_URL + `${idList}`)
        .toPromise()
    ).data;
  }

  async get(id: string): Promise<CategoryDto> {
    return (
      await this.httpService
        .get<CategoryDto>(CATEGORIES_URL + `${id}/`)
        .toPromise()
    ).data;
  }
}
