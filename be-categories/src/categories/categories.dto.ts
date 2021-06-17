import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Category } from './category.entity';

export class UpdateCategoryDto {
  @ApiProperty()
  name: string;
}

export class AddCategoryDto extends PartialType(UpdateCategoryDto) {}

export class CategoryDto {
  id: string;
  name: string;
  postCount: number;
  productCount: number;

  static fromEntity(entity: Category, postCount: number, productCount: number) {
    if (!entity) {
      return null;
    }

    const dto = new CategoryDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.postCount = postCount;
    dto.productCount = productCount;

    return dto;
  }
}
