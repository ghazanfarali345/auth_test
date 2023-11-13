import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { SendOtpTypeEnum } from './enums';

export class SendOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SendOtpTypeEnum)
  type: SendOtpTypeEnum;
}
