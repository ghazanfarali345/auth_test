import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LogutDTO {
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  @IsNotEmpty()
  @IsString()
  deviceType?: string;
}
