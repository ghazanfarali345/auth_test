import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { sendOtpType } from './enums';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
