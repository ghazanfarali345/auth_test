import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { TransactionEnum } from './dto/enums';
import { User } from 'src/users/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ ref: () => User })
  userId: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop({})
  description: string;

  @Prop({ default: false })
  scheduledCashOut: boolean;

  @Prop({})
  scheduledCashOutDate: Date;

  @Prop({ default: false })
  scheduledCashIn: boolean;

  @Prop({})
  scheduledCashInDate: Date;

  @Prop({ required: true, enum: TransactionEnum })
  type: TransactionEnum;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
