import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronJob {
  constructor() {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async handleCron() {}
}
