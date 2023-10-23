import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  // role: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  otp: string;

  @Prop()
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
