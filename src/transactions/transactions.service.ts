import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';

import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import { Transaction } from './transaction.schema';
import { paginationWithAggregation } from 'src/utils/paginationwithAggregation';
import { IGetUserAuthInfoRequest, genericResponseType } from 'src/interfaces';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    readonly TransactionModel: Model<Transaction>,
    readonly notificationsService: NotificationsService,
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

  async findAll(req: IGetUserAuthInfoRequest) {
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

    let { balance } = await this.getBalance(req);

    let result: any = await paginationWithAggregation(
      this.TransactionModel,
      req,
      searchQuery,
      customStages,
    );
    result.balance = balance;
    return {
      success: true,
      message: 'Category fetched successfully',
      result,
    };
  }

  async getBalance(req: IGetUserAuthInfoRequest) {
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

    const incomeTransactions = await this.TransactionModel.find({
      userId: req.user._id,
      type: 'INCOME',
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).exec();

    const expenseTransactions = await this.TransactionModel.find({
      userId: req.user._id,
      type: 'EXPENSE',
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
    const balance = income - expense;

    return {
      income,
      expense,
      balance,
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

  async buttonNotification(transaction) {
    await this.notificationsService.create({
      to: transaction.userId,
      title: 'Scheduled Transaction',
      description: `Today is the scheduled date for your transaction: ${transaction.description}`,
      type: 'BUTTON',
    });
  }
  async reminderNotification(transaction) {
    await this.notificationsService.create({
      to: transaction.userId,
      title: 'Upcoming Transaction',
      description: `You have an upcoming transaction in _ days: ${transaction.description}`,
      type: 'REMINDER',
    });
  }

  async handleNotifications() {
    const currentDate = new Date();

    const transactions = await this.TransactionModel.find({
      $or: [
        {
          scheduledCashOut: true,
          scheduledCashOutDate: { $gte: currentDate },
        },
        {
          scheduledCashIn: true,
          scheduledCashInDate: { $gte: currentDate },
        },
      ],
    }).exec();

    transactions.forEach(async (transaction) => {
      // Send notification 2 days before scheduled date
      const notificationDate = new Date(
        transaction.scheduledCashOutDate.getTime() - 2 * 24 * 60 * 60 * 1000,
      );

      console.log(
        { currentDate, notificationDate },
        currentDate.toDateString() === notificationDate.toDateString(),
        new Date(transaction.scheduledCashOutDate).getTime() ===
          currentDate.getTime(),
      );

      if (currentDate === notificationDate) {
        this.reminderNotification(transaction);
      }
      if (
        new Date(transaction.scheduledCashOutDate).getTime() ===
          currentDate.getTime() ||
        new Date(transaction.scheduledCashInDate).getTime() ===
          currentDate.getTime()
      ) {
        this.buttonNotification(transaction);
      }
    });
  }
}
