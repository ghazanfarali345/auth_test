import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
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
  platform: PlatformEnum; // auth type

  @IsString()
  @IsNotEmpty()
  pushNotification?: string;

  @ValidateIf((object) => object.pushNotification === 'true')
  @IsString()
  @IsNotEmpty()
  deviceType?: string;

  @ValidateIf((object) => object.pushNotification === 'true')
  @IsString()
  @IsNotEmpty()
  deviceToken?: string;
}
