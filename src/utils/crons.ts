import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class CronJob {
  constructor(private readonly transactionService: TransactionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.transactionService.handleNotifications();
  }
}
