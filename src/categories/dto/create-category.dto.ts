import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TypeEnum } from '../category.schema';

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icon?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  type: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
