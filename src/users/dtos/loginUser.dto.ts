import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlatformEnum } from './enums';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(PlatformEnum)
  @IsNotEmpty()
  platform: PlatformEnum;

  @IsEnum(PlatformEnum)
  @IsNotEmpty()
  deviceToken: PlatformEnum;
}
