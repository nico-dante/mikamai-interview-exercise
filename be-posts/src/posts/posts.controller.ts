import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Put,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { MieLogger } from '../utils/logging.utils';
import { AddPostDto, PostDto, UpdatePostDto } from './posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private logger: MieLogger, private postsService: PostsService) {
    logger.setContext(PostsController.name);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async find(
    @Query('q') search?: string,
    @Query('categoryId') categoryId?: string | Array<string>,
  ) {
    const categoryIds: Array<string> = categoryId
      ? typeof categoryId === 'string'
        ? [categoryId]
        : categoryId
      : null;

    const posts = await this.postsService.find(search, categoryIds);

    return (posts || []).map((p) => PostDto.fromEntity(p, null));
  }

  @Get('count')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async count(
    @Query('q') search?: string,
    @Query('categoryId') categoryId?: string | Array<string>,
  ) {
    const categoryIds: Array<string> = categoryId
      ? typeof categoryId === 'string'
        ? [categoryId]
        : categoryId
      : null;

    return this.postsService.count(search, categoryIds);
  }

  @Post()
  async add(@Body() dto: AddPostDto) {
    if (
      !dto.title ||
      dto.title === '' ||
      !dto.body ||
      dto.body === '' ||
      !dto.categoryId ||
      dto.categoryId === ''
    ) {
      throw new BadRequestException('missing mandatory parameters');
    }

    const post = await this.postsService.add(
      dto.title,
      dto.body,
      dto.categoryId,
    );

    return PostDto.fromEntity(post, null);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const post = await this.postsService.get(id);

    return PostDto.fromEntity(post, null);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    let post = await this.postsService.get(id);

    if (!post) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    if (
      !dto.title ||
      dto.title === '' ||
      !dto.body ||
      dto.body === '' ||
      !dto.categoryId ||
      dto.categoryId === ''
    ) {
      throw new BadRequestException('missing mandatory parameters');
    }

    post = await this.postsService.update(
      id,
      dto.title,
      dto.body,
      dto.categoryId,
    );

    return PostDto.fromEntity(post, null);
  }

  @Delete(':id')
  @ApiQuery({ name: 'soft', enum: ['true', 'false'], required: false })
  async delete(@Param('id') id: string, @Query('soft') soft?: string) {
    let post = await this.postsService.get(id);

    if (!post) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    post = await this.postsService.delete(
      id,
      soft && soft.toLowerCase() === 'true',
    );

    return PostDto.fromEntity(post, null);
  }
}
