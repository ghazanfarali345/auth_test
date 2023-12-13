import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { multerConfig } from 'src/utils/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('icon', multerConfig))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File | any,
    @Req() req: Request,
  ) {
    createCategoryDto.icon = `http://${req.get('host')}/${file?.filename}`;
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.categoriesService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne({ _id: id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update({ _id: id }, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove({ _id: id });
  }
}
