import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FaqDocument = HydratedDocument<Faq>;

@Schema()
export class Faq {
  @Prop()
  question: string;

  @Prop()
  answer: string;

  @Prop()
  status: string;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
