import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service'; // Import your UsersService here
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class CronJob {
  constructor(private readonly transactionService: TransactionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('cron is running');
    // this.transactionService.handleNotifications();
    console.log('function is called');
  }
}
