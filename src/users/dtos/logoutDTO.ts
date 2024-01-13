import { IsString, IsNotEmpty } from 'class-validator';

export class LogutDTO {
  @IsNotEmpty()
  @IsString()
  deviceToken: string;
}
