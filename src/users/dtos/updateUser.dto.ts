import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNo?: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  isVerified?: boolean;

  @IsOptional()
  @IsNotEmpty()
  otp?: string;
}
