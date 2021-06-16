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
import { AddProductDto, ProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private logger: MieLogger,
    private productsService: ProductsService,
  ) {
    logger.setContext(ProductsController.name);
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

    const posts = await this.productsService.find(search, categoryIds);

    return (posts || []).map((p) => ProductDto.fromEntity(p, null));
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

    return this.productsService.count(search, categoryIds);
  }

  @Post()
  async add(@Body() dto: AddProductDto) {
    if (
      !dto.name ||
      dto.name === '' ||
      dto.price === null ||
      dto.price === undefined ||
      !dto.categoryId ||
      dto.categoryId === ''
    ) {
      throw new BadRequestException('missing mandatory parameters');
    }

    const post = await this.productsService.add(
      dto.name,
      dto.price,
      dto.categoryId,
    );

    return ProductDto.fromEntity(post, null);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const post = await this.productsService.get(id);

    return ProductDto.fromEntity(post, null);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    let post = await this.productsService.get(id);

    if (!post) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    if (
      !dto.name ||
      dto.name === '' ||
      dto.price === null ||
      dto.price === undefined ||
      !dto.categoryId ||
      dto.categoryId === ''
    ) {
      throw new BadRequestException('missing mandatory parameters');
    }

    post = await this.productsService.update(
      id,
      dto.name,
      dto.price,
      dto.categoryId,
    );

    return ProductDto.fromEntity(post, null);
  }

  @Delete(':id')
  @ApiQuery({ name: 'soft', enum: ['true', 'false'], required: false })
  async delete(@Param('id') id: string, @Query('soft') soft?: string) {
    let post = await this.productsService.get(id);

    if (!post) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    post = await this.productsService.delete(
      id,
      soft && soft.toLowerCase() === 'true',
    );

    return ProductDto.fromEntity(post, null);
  }
}
