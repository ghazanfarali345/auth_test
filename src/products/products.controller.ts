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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IGetUserAuthInfoRequest } from 'src/interfaces';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: IGetUserAuthInfoRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    let body: CreateProductDto = { ...createProductDto, userId: req.user._id };
    return this.productsService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: IGetUserAuthInfoRequest) {
    return this.productsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
