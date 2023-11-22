import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import { Transaction } from './transaction.schema';
import { paginationWithAggregation } from 'src/utils/paginationwithAggregation';
import { IGetUserAuthInfoRequest } from 'src/interfaces';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    readonly TransactionModel = Model<Transaction>,
  ) {}

  async create(req: IGetUserAuthInfoRequest, body: CreateTransactionDto) {
    let transaction = await this.TransactionModel.create({
      userId: req.user._id,
      ...body,
    });

    if (!transaction)
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
          success: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      success: true,
      message: 'Record is added successfully',
      data: transaction,
    };
  }

  async findAll(req: Request) {
    let searchQuery = {};

    let customStages = [
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ];

    let result = await paginationWithAggregation(
      this.TransactionModel,
      req,
      searchQuery,
      customStages,
    );
    return {
      success: true,
      message: 'Category fetched successfully',
      result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
