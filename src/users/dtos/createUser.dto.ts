import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PlatformEnum } from './enums';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(PlatformEnum)
  @IsNotEmpty()
  platform: PlatformEnum;
}
