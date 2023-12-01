import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';

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

export function toMongoObjectId({ value, key }): Types.ObjectId {
  if (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  ) {
    return new Types.ObjectId(value);
  } else {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid object id',
        success: false,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

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
  @IsString()
  scheduledCashOutDate?: string;

  @IsOptional()
  @IsBoolean()
  scheduledCashIn?: boolean;

  @ValidateIf((object) => object.scheduledCashIn === true)
  @IsNotEmpty()
  @IsString()
  scheduledCashInDate?: string;

  @IsEnum(TransactionEnum)
  type: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
