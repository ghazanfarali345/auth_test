import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Model, ObjectId } from 'mongoose';
import { FaqDocument } from './faq.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel('Faq') private readonly faqModel: Model<FaqDocument>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const faq = await this.faqModel.create(createFaqDto);

    return {
      success: true,
      message: 'Faq created successfully',
      data: faq,
    };
  }

  async findAll() {
    const faq = await this.faqModel.find();

    return {
      success: true,
      message: 'Faq fetched successfully',
      data: faq,
    };
  }

  async findOne(id: ObjectId) {
    const faq = await this.faqModel.findOne({ _id: id });

    return {
      success: true,
      message: 'Faq fetched successfully',
      data: faq,
    };
  }

  async update(filter: any, updateFaqDto: CreateFaqDto) {
    const faq = await this.faqModel.findOneAndUpdate(filter, updateFaqDto, {
      new: true,
    });

    return {
      success: true,
      message: 'Faq fetched successfully',
      data: null,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} faq`;
  }
}
