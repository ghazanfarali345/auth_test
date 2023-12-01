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
    ///   The below piece of code in this comment block have to convert in reuseable code
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

    const incomeTransactions =
      await this.transactionService.TransactionModel.find({
        userId: req.user._id,
        type: 'INCOME',
        transactionFulfilled: true,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).exec();

    const expenseTransactions =
      await this.transactionService.TransactionModel.find({
        userId: req.user._id,
        type: 'EXPENSE',
        transactionFulfilled: true,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).exec();

    const income = incomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const expense = expenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    ///   The above piece of code have to convert in reuseable code
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
  ): { name: string; percent: number; color: string }[] {
    const totalAmount = this.getTotalAmount(transactions);

    const categoryPercentageMap: Record<
      string,
      { percent: number; color: string }
    > = {};

    transactions.forEach((transaction) => {
      const percent = (transaction.amount / totalAmount) * 100;

      if (!categoryPercentageMap[transaction.category]) {
        categoryPercentageMap[transaction.category] = {
          percent: 0,
          color: transaction.color,
        };
      }

      categoryPercentageMap[transaction.category].percent += percent;
    });

    // Convert the map to an array of objects
    const categoryPercentage: {
      name: string;
      percent: number;
      color: string;
    }[] = Object.keys(categoryPercentageMap).map((category) => ({
      name: category,
      percent: parseFloat(categoryPercentageMap[category].percent.toFixed(2)),
      color: categoryPercentageMap[category].color,
    }));

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
