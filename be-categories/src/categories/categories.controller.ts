import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MieLogger } from '../utils/logging.utils';
import { AddCategoryDto, CategoryDto } from './categories.dto';
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

    return (categories || []).map((c) => new CategoryDto(c.name, 0, 0));
  }

  @Post()
  async add(@Body() dto: AddCategoryDto) {
    if (!dto.name || dto.name === '') {
      throw new BadRequestException('missing mandatory parameters');
    }

    const category = await this.categoriesService.add(dto.name);

    return category ? new CategoryDto(category.name, 0, 0) : null;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const category = await this.categoriesService.get(id);

    return category ? new CategoryDto(category.name, 0, 0) : null;
  }
}
