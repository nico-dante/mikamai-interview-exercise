import { ApiProperty } from '@nestjs/swagger';

export class AddCategoryDto {
  @ApiProperty()
  name: string;
}

export class CategoryDto {
  name: string;
  postCount: number;
  productCount: number;

  constructor(name: string, postCount: number, productCount: number) {
    this.name = name;
    this.postCount = postCount;
    this.productCount = productCount;
  }
}
