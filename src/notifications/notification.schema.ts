import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Transaction } from 'src/transactions/transaction.schema';
import { User } from 'src/users/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ ref: () => User })
  to: Types.ObjectId; // reciever

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: () => Boolean, default: false })
  isRead: boolean;

  @Prop({ required: true, enum: ['NORMAL', 'REMINDER', 'BUTTON'] })
  type: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

  @Prop({ ref: () => Transaction, type: () => Types.ObjectId })
  transactionId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
