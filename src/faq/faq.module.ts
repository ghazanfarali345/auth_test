import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqSchema } from './faq.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Faq', schema: FaqSchema }])],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
