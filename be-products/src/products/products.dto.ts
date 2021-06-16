import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Product } from './product.entity';

export class UpdateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  categoryId: string;
}

export class AddProductDto extends PartialType(UpdateProductDto) {}

export class ProductDto {
  id: string;
  name: string;
  price: number;
  category: string;

  static fromEntity(entity: Product, categoryName: string) {
    if (!entity) {
      return null;
    }

    const dto = new ProductDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.price = entity.price;
    dto.category = categoryName;

    return dto;
  }
}
