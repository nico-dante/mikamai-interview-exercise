import { CategoryDto } from '../categories/categories.dto';

export class PostDto {
  id: string;
  title: string;
  body: string;
  category: CategoryDto;
}
