import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionService = TransactionsService,
  ) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  // async findAll() {
  //   const currentMonth = new Date().getMonth() + 1; // Assuming month starts from 1
  //   const startOfMonth = new Date(
  //     new Date().getFullYear(),
  //     currentMonth - 1,
  //     1,
  //   );
  //   const endOfMonth = new Date(
  //     new Date().getFullYear(),
  //     currentMonth,
  //     0,
  //     23,
  //     59,
  //     59,
  //     999,
  //   );

  //   const incomeTransactions = await this.transactionService
  //     .find({
  //       type: 'INCOME',
  //       createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  //     })
  //     .exec();

  //   const expenseTransactions = await this.TransactionModel.find({
  //     type: 'EXPENSE',
  //     createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  //   }).exec();

  //   const income = incomeTransactions.reduce(
  //     (sum, transaction) => sum + transaction.amount,
  //     0,
  //   );
  //   const expense = expenseTransactions.reduce(
  //     (sum, transaction) => sum + transaction.amount,
  //     0,
  //   );
  //   const balance = income - expense;

  //   const incomeCategories =
  //     this.calculateCategoryPercentage(incomeTransactions);
  //   const expenseCategories =
  //     this.calculateCategoryPercentage(expenseTransactions);

  //   return {
  //     income,
  //     expense,
  //     balance,
  //     incomeCategories,
  //     expenseCategories,
  //   };
  // }

  // private calculateCategoryPercentage(
  //   transactions: Transaction[],
  // ): Record<string, number> {
  //   const categoryPercentage: Record<string, number> = {};

  //   transactions.forEach((transaction) => {
  //     if (!categoryPercentage[transaction.category]) {
  //       categoryPercentage[transaction.category] = 0;
  //     }

  //     categoryPercentage[transaction.category] +=
  //       (transaction.amount / this.getTotalAmount(transactions)) * 100;
  //   });

  //   return categoryPercentage;
  // }

  // private getTotalAmount(transactions: Transaction[]): number {
  //   return transactions.reduce(
  //     (sum, transaction) => sum + transaction.amount,
  //     0,
  //   );
  // }

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
