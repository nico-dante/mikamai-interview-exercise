import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsService } from '../posts/posts.service';
import { ProductsService } from '../products/products.service';
import { MieLogger } from '../utils/logging.utils';
import {
  AddCategoryDto,
  CategoryDto,
  UpdateCategoryDto,
} from './categories.dto';
import { CategoriesService } from './categories.service';

@ApiTags('exercise')
@Controller('categories')
export class CategoriesController {
  constructor(
    private logger: MieLogger,
    private categoriesService: CategoriesService,
    private postsService: PostsService,
    private productsService: ProductsService,
  ) {
    logger.setContext(CategoriesController.name);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'id', required: false })
  async find(
    @Query('q') search?: string,
    @Query('id') id?: string | Array<string>,
  ) {
    const ids: Array<string> = id ? (typeof id === 'string' ? [id] : id) : null;

    if (ids && ids.length === 0) {
      return [];
    }

    const categories = await this.categoriesService.find(search, ids);

    const categoryIds = categories.map((c) => c.id);

    const postsCountMap = await this.postsService.countList(categoryIds);
    const productsCountMap = await this.productsService.countList(categoryIds);

    return (categories || []).map((c) =>
      CategoryDto.fromEntity(c, postsCountMap[c.id], productsCountMap[c.id]),
    );
  }

  @Get('count')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'id', required: false })
  async count(
    @Query('q') search?: string,
    @Query('id') id?: string | Array<string>,
  ) {
    const ids: Array<string> = id ? (typeof id === 'string' ? [id] : id) : null;

    if (ids && ids.length === 0) {
      return [];
    }

    return this.categoriesService.count(search, ids);
  }

  @Post()
  async add(@Body() dto: AddCategoryDto) {
    if (!dto.name || dto.name.length === 0) {
      throw new BadRequestException('missing mandatory parameters');
    }

    const category = await this.categoriesService.add(dto.name);

    return CategoryDto.fromEntity(
      category,
      await this.postsService.count([category.id]),
      await this.productsService.count([category.id]),
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const category = await this.categoriesService.get(id);

    return category
      ? CategoryDto.fromEntity(
          category,
          await this.postsService.count([category.id]),
          await this.productsService.count([category.id]),
        )
      : null;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    let category = await this.categoriesService.get(id);

    if (!category) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    if (!dto.name || dto.name.length === 0) {
      throw new BadRequestException('missing mandatory parameters');
    }

    category = await this.categoriesService.update(id, dto.name);

    return CategoryDto.fromEntity(
      category,
      await this.postsService.count([category.id]),
      await this.productsService.count([category.id]),
    );
  }

  @Delete(':id')
  @ApiQuery({ name: 'soft', enum: ['true', 'false'], required: false })
  async delete(@Param('id') id: string, @Query('soft') soft?: string) {
    let category = await this.categoriesService.get(id);

    if (!category) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    const postsCount = await this.postsService.count([category.id]);
    const productsCount = await this.productsService.count([category.id]);

    if (postsCount + productsCount > 0) {
      throw new ConflictException(
        `there are ${postsCount} posts and ${productsCount} prodcuts referenced by category with id ${category.id}`,
      );
    }

    category = await this.categoriesService.delete(
      id,
      soft && soft.toLowerCase() === 'true',
    );

    return CategoryDto.fromEntity(category, 0, 0);
  }
}
