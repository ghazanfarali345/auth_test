import { Controller, Post, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dtos/loginUser.dto';
import { CreateUserDTO } from './dtos/createUser.dto';
import { VerifyUserDTO } from './dtos/verifyUser.dto';
import { SendOtpDTO } from './dtos/sendOTP.dto';
import { ResetPasswordDTO } from './dtos/resetPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  registerUsers(@Body() body: CreateUserDTO) {
    return this.usersService.register(body);
  }

  @Post('/sendOtp')
  sendOtp(@Body() body: SendOtpDTO) {
    return this.usersService.sendOtp(body);
  }

  @Put('/verifyUser')
  verifyUser(@Body() body: VerifyUserDTO) {
    return this.usersService.verifyUser(body);
  }

  @Post('/login')
  loginUser(@Body() body: LoginDTO): Promise<genericResponseType> {
    return this.usersService.login(body);
  }

  @Post('/forgetPassword')
  forgetPassword(@Body() body: SendOtpDTO) {
    return this.usersService.sendOtp(body);
  }

  @Put('/resetPassword')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.usersService.resetPassword(body);
  }
}
