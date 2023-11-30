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
  @IsString()
  toDate?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

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
