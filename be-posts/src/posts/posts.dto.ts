import { ApiProperty, PartialType } from '@nestjs/swagger';
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
  category: string;

  static fromEntity(entity: Post, categoryName: string) {
    if (!entity) {
      return null;
    }

    const dto = new PostDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.body = entity.body;
    dto.category = categoryName;

    return dto;
  }
}
