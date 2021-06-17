import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CategoryDto } from '../categories/categories.dto';
import { Post } from './post.entity';

export class UpdatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  categoryId: string;
}

export class AddPostDto extends PartialType(UpdatePostDto) {}

export class PostDto {
  id: string;
  title: string;
  body: string;
  category: CategoryDto;

  static fromEntity(entity: Post, category: CategoryDto) {
    if (!entity) {
      return null;
    }

    const dto = new PostDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.body = entity.body;
    dto.category = category;

    return dto;
  }
}
