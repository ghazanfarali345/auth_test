import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from './category.schema';
import { pagination } from 'src/utils/pagination';
import { Request } from 'express';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categories')
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(body: CreateCategoryDto) {
    const category = await this.categoryModel.create(body);

    if (!category)
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
          success: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      success: true,
      message: 'Category is added successfully',
      data: category,
    };
  }

  async findAll(req: Request) {
    let customQuery = {
      userId: {
        $exists: false,
      },
    };
    const result = await pagination(this.categoryModel, req, customQuery);
    return {
      success: true,
      message: 'Category fetched successfully',
      data: result,
    };
  }

  async findOne(filter: { [key: string]: any }) {
    const category = await this.categoryModel.findOne({
      isDeleted: false,
      ...filter,
    });
    return {
      success: true,
      message: 'Category fetched successfully',
      data: category,
    };
  }

  async update(
    filter: { [key: string]: any },
    updateCategoryData: UpdateCategoryDto,
  ) {
    await this.categoryModel.findOneAndUpdate(
      { isDeleted: false, ...filter },
      updateCategoryData,
      {
        new: true,
      },
    );

    return {
      success: true,
      message: 'Category updated successfully',
      data: null,
    };
  }

  async remove(filter: { [key: string]: any }) {
    await this.categoryModel.findOneAndUpdate(filter, { isDeleted: true });

    return {
      success: true,
      message: 'Category deleted successfully',
      data: null,
    };
  }
}
