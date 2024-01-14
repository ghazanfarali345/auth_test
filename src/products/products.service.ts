import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { ProductDocument } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IGetUserAuthInfoRequest } from 'src/interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let product = await this.productModel.create(createProductDto);

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(req: IGetUserAuthInfoRequest) {
    let products = await this.productModel.find({
      userId: req.user._id,
      isDeleted: false,
    });
    return {
      success: true,
      message: 'Product fetched successfully',
      data: products,
    };
  }

  async findOne(id: string) {
    let products = await this.productModel.find({ _id: id });
    return {
      success: true,
      message: 'Product fetched successfully',
      data: products,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let products = await this.productModel.findOneAndUpdate(
      { _id: id },
      updateProductDto,
      { new: true },
    );

    return {
      success: true,
      message: 'Product fetched successfully',
      data: products,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
