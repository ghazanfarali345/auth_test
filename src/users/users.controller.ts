import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dtos/loginUser.dto';
import { CreateUserDTO } from './dtos/createUser.dto';
import { VerifyUserDTO } from './dtos/verifyUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IGetUserAuthInfoRequest, genericResponseType } from 'src/interfaces';
import { Request } from 'express';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  registerUsers(@Body() body: CreateUserDTO) {
    return this.usersService.register(body);
  }

  @Post('/verify')
  verifyUser(@Body() body: VerifyUserDTO) {
    return this.usersService.verifyUser(body);
  }

  @Post('/login')
  loginUser(
    @Req() req: Request,
    @Body() body: LoginDTO,
  ): Promise<genericResponseType> {
    return this.usersService.login(req, body);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: IGetUserAuthInfoRequest) {
    return this.usersService.logout();
  }
}
