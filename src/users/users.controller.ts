import {
  Controller,
  Post,
  Body,
  Put,
  Req,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dtos/loginUser.dto';
import { CreateUserDTO } from './dtos/createUser.dto';
import { VerifyUserDTO } from './dtos/verifyUser.dto';
import { SendOtpDTO } from './dtos/sendOTP.dto';
import { ResetPasswordDTO } from './dtos/resetPassword.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { genericResponseType, IGetUserAuthInfoRequest } from 'src/interfaces';
import { UpdateUserDTO } from './dtos/updateUser.dto';
import { UpdateDTO } from './dtos/updateDTO';

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

  @Patch('/resetPassword')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.usersService.resetPassword(body);
  }

  @Patch('/addCategoryToUser')
  @UseGuards(AuthGuard)
  addCategoryToUser(@Req() req: IGetUserAuthInfoRequest, @Body() body: any) {
    console.log({ user: req.user });
    return this.usersService.addCategoryToUser(req.user._id, body);
  }

  @Patch('/removeCategoryToUser')
  @UseGuards(AuthGuard)
  removeCategoryToUser(@Req() req: IGetUserAuthInfoRequest, @Body() body: any) {
    return this.usersService.removeCategoryToUser(req.user._id, body);
  }

  @Get('/myCategories')
  @UseGuards(AuthGuard)
  getMyCategories(@Req() req: IGetUserAuthInfoRequest) {
    return this.usersService.categoryList(req);
  }

  @Get('/myProfile')
  @UseGuards(AuthGuard)
  getMyProfile(@Req() req: IGetUserAuthInfoRequest) {
    return this.usersService.findByEmail(req.user.email);
  }

  @Patch('/updateProfile')
  @UseGuards(AuthGuard)
  updateProfile(@Req() req: IGetUserAuthInfoRequest) {
    let body: UpdateDTO = req.body;
    return this.usersService.findOneAndUpdate({ email: req.user.email }, body);
  }
}
