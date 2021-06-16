import {
  BadRequestException,
  Body,
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
  ) {
    logger.setContext(CategoriesController.name);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false })
  async find(@Query('q') search?: string) {
    const categories = await this.categoriesService.find(search);

    return (categories || []).map((c) => CategoryDto.fromEntity(c, 0, 0));
  }

  @Get('count')
  @ApiQuery({ name: 'q', required: false })
  async count(@Query('q') search?: string) {
    return this.categoriesService.count(search);
  }

  @Post()
  async add(@Body() dto: AddCategoryDto) {
    if (!dto.name || dto.name.length === 0) {
      throw new BadRequestException('missing mandatory parameters');
    }

    const category = await this.categoriesService.add(dto.name);

    return CategoryDto.fromEntity(category, 0, 0);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const category = await this.categoriesService.get(id);

    return CategoryDto.fromEntity(category, 0, 0);
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

    return CategoryDto.fromEntity(category, 0, 0);
  }

  @Delete(':id')
  @ApiQuery({ name: 'soft', enum: ['true', 'false'], required: false })
  async delete(@Param('id') id: string, @Query('soft') soft?: string) {
    let category = await this.categoriesService.get(id);

    if (!category) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    category = await this.categoriesService.delete(
      id,
      soft && soft.toLowerCase() === 'true',
    );

    return CategoryDto.fromEntity(category, 0, 0);
  }
}
