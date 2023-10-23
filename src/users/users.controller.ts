import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dtos/loginUser.dto';
import { CreateUserDTO } from './dtos/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  registerUsers(@Body() body: CreateUserDTO) {
    return this.usersService.register(body);
  }

  @Post('/login')
  loginUser(@Body() body: LoginDTO): Promise<genericResponseType> {
    return this.usersService.login(body);
  }
}
