import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/transaction.schema';
import { IGetUserAuthInfoRequest } from 'src/interfaces';
import { Types } from 'mongoose';

@Injectable()
export class HomeService {
  constructor(private readonly transactionService: TransactionsService) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  async findAll(req: IGetUserAuthInfoRequest) {
    const currentMonth = new Date().getMonth() + 1;
    let startOfMonth: any = new Date(
      new Date().getFullYear(),
      currentMonth - 1,
      1,
    );
    let endOfMonth: any = new Date(
      new Date().getFullYear(),
      currentMonth,
      0,
      23,
      59,
      59,
      999,
    );

    if (req.query && req.query.startDate) {
      startOfMonth = req.query.startOfMonth;
    }
    if (req.query && req.query.endDate) {
      endOfMonth = req.query.endOfMonth;
    }

    console.log({ startOfMonth, endOfMonth });

    const incomeTransactions =
      await this.transactionService.TransactionModel.find({
        userId: req.user._id,
        type: 'INCOME',
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).exec();

    const expenseTransactions =
      await this.transactionService.TransactionModel.find({
        userId: req.user._id,
        type: 'EXPENSE',
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).exec();

    console.log({ incomeTransactions, expenseTransactions });
    const income = incomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const expense = expenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const balance = income - expense;

    const incomeCategories =
      this.calculateCategoryPercentage(incomeTransactions);
    const expenseCategories =
      this.calculateCategoryPercentage(expenseTransactions);

    return {
      success: true,
      message: 'Stats fetched successfully',
      data: {
        income,
        expense,
        balance,
        incomeCategories,
        expenseCategories,
      },
    };
  }

  private calculateCategoryPercentage(
    transactions: Transaction[],
  ): Record<string, number> {
    const categoryPercentage: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (!categoryPercentage[transaction.category]) {
        categoryPercentage[transaction.category] = 0;
      }

      categoryPercentage[transaction.category] +=
        (transaction.amount / this.getTotalAmount(transactions)) * 100;
    });

    return categoryPercentage;
  }

  private getTotalAmount(transactions: Transaction[]): number {
    return transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

  update(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  remove(id: number) {
    return `This action removes a #${id} home`;
  }
}
