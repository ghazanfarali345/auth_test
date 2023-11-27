import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNo?: string;

  @IsOptional()
  @IsNotEmpty()
  image?: string;
}
