import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './createTransaction.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsBoolean()
  transactionFulfilled: boolean;
}
