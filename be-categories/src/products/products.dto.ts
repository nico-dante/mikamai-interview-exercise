import { CategoryDto } from '../categories/categories.dto';

export class ProductDto {
  id: string;
  name: string;
  price: number;
  category: CategoryDto;
}
