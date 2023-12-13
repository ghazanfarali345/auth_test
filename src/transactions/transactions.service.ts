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
import { PushNotificationService } from 'src/utils/pushNotification.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    readonly TransactionModel: Model<Transaction>,
    readonly notificationsService: NotificationsService,
    readonly pushNotificationService: PushNotificationService,
  ) {}

  async create(req: IGetUserAuthInfoRequest, body: CreateTransactionDto) {
    const transaction = await this.TransactionModel.create({
      userId: req.user._id,
      transactionFulfilled:
        body.scheduledCashIn || body.scheduledCashOut ? false : true,
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
    const searchQuery = {
      userId: req.user._id,
    };

    const customStages = [
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ];

    const { balance } = await this.getBalance(req);

    const result: any = await paginationWithAggregation(
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
      transactionFulfilled: true,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).exec();

    const expenseTransactions = await this.TransactionModel.find({
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

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    req: Request,
  ) {
    let transactionExist = await this.TransactionModel.findOne({ _id: id });
    if (!transactionExist) {
      return {
        success: true,
        message: 'Transaction has been removed, can not add it now',
        data: null,
      };
    }

    await this.TransactionModel.findByIdAndUpdate(
      { _id: id },
      updateTransactionDto,
      { new: true },
    );

    if (req.query.notifId) {
      await this.notificationsService.remove({ _id: req.query.notifId });
    }

    return {
      success: true,
      message: 'Transaction updated successfully',
      data: null,
    };
  }

  async remove(filter: { [key: string]: any }, req: Request) {
    let transactionExist = await this.TransactionModel.findOne(filter);

    if (!transactionExist) {
      return {
        success: true,
        message: 'Transaction has been removed earlier, can not remove it now.',
        data: null,
      };
    }

    await this.TransactionModel.findOneAndDelete(filter);

    if (req.query.notifId) {
      await this.notificationsService.remove({ _id: req.query.notifId });
    }

    return {
      success: true,
      message: 'Transaction removed successfully',
      data: null,
    };
  }

  async buttonNotification(transaction) {
    await this.notificationsService.create({
      to: transaction.userId,
      title: 'Scheduled Transaction',
      description: `Today is the scheduled date for your transaction amount: ${transaction.amount}`,
      type: 'BUTTON',
      transactionId: transaction._id,
    });

    // this.pushNotificationService.sendNotification('token', 'title', 'body');
  }
  async reminderNotification(transaction) {
    await this.notificationsService.create({
      to: transaction.userId,
      title: 'Reminder for upcoming transaction',
      description: `You have an upcoming transaction in _ days: 2`,
      type: 'REMINDER',
      transactionId: transaction._id,
    });
  }

  async handleNotifications() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const transactions = await this.TransactionModel.find({
      $or: [
        {
          scheduledCashOut: true,
          scheduledCashOutDate: { $gte: currentDate },
        },
        // {
        //   scheduledCashIn: true,
        //   scheduledCashInDate: { $gte: currentDate },
        // },
      ],
    }).exec();

    console.log({ transactions });

    transactions.forEach(async (transaction) => {
      const notificationDate = new Date(
        transaction.scheduledCashOutDate.getTime() - 2 * 24 * 60 * 60 * 1000,
      );

      console.log(
        { currentDate, notificationDate },
        currentDate.toDateString() === notificationDate.toDateString(),
      );

      console.log(
        new Date(transaction.scheduledCashOutDate).toDateString(),
        currentDate.toDateString(),
        new Date(transaction.scheduledCashOutDate).toDateString() ===
          currentDate.toDateString(),
      );

      if (currentDate.toDateString() === notificationDate.toDateString()) {
        this.reminderNotification(transaction);
      }
      if (
        new Date(transaction.scheduledCashOutDate).toDateString() ===
        currentDate.toDateString()
      ) {
        this.buttonNotification(transaction);
      }
    });
  }
}
