import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { sendOtpType } from './enums';

export class SendOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(sendOtpType)
  type: sendOtpType;
}
