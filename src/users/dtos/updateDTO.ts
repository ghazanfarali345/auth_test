import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class UpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNo?: string;

  @IsOptional()
  @IsNotEmpty()
  // @IsObject()
  // @IsString()
  profileImage?: any;
}
