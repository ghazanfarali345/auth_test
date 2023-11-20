import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  ValidateIf,
  IsDate,
  IsNumber,
} from 'class-validator';
import { TransactionEnum } from './enums';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  scheduledCashOut?: boolean;

  @ValidateIf((object) => object.scheduledCashOut === true)
  @IsNotEmpty()
  @IsDate()
  scheduledCashOutDate?: Date;

  @IsOptional()
  @IsBoolean()
  scheduledCashIn?: boolean;

  @ValidateIf((object) => object.scheduledCashIn === true)
  @IsNotEmpty()
  @IsDate()
  scheduledCashInDate?: Date;

  @IsEnum(TransactionEnum)
  type: string;
}
