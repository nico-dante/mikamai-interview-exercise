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
import { CategoriesService } from '../categories/categories.service';
import { MieLogger } from '../utils/logging.utils';
import { AddProductDto, ProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private logger: MieLogger,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
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

    const products = await this.productsService.find(search, categoryIds);

    const categories = await this.categoriesService.list(
      products.map((p) => p.categoryId),
    );

    return (products || []).map((p) =>
      ProductDto.fromEntity(
        p,
        categories.find((c) => c.id === p.categoryId).name,
      ),
    );
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

    const category = await this.categoriesService.get(dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `category with id ${dto.categoryId} not found`,
      );
    }

    const product = await this.productsService.add(
      dto.name,
      dto.price,
      dto.categoryId,
    );

    return ProductDto.fromEntity(product, category.name);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.productsService.get(id);

    if (product) {
      const category = await this.categoriesService.get(product.categoryId);

      return ProductDto.fromEntity(product, category.name);
    }

    return null;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    let product = await this.productsService.get(id);

    if (!product) {
      throw new NotFoundException(`product with id ${id} not found`);
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

    const category = await this.categoriesService.get(dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `category with id ${dto.categoryId} not found`,
      );
    }

    product = await this.productsService.update(
      id,
      dto.name,
      dto.price,
      dto.categoryId,
    );

    return ProductDto.fromEntity(product, category.name);
  }

  @Delete(':id')
  @ApiQuery({ name: 'soft', enum: ['true', 'false'], required: false })
  async delete(@Param('id') id: string, @Query('soft') soft?: string) {
    let product = await this.productsService.get(id);

    if (!product) {
      throw new NotFoundException(`product with id ${id} not found`);
    }

    product = await this.productsService.delete(
      id,
      soft && soft.toLowerCase() === 'true',
    );

    return ProductDto.fromEntity(product, null);
  }
}
