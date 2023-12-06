import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './transaction.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PushNotificationService } from 'src/utils/pushNotification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PushNotificationService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
