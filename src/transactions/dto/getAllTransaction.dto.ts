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

export class GetTransactionDto {
  @IsOptional()
  @IsEnum(TransactionEnum)
  @IsNotEmpty()
  type?: TransactionEnum;

  @IsOptional()
  @IsDate()
  toDate?: Date;

  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsBoolean()
  showAll?: boolean;
}
