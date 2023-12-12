import {
  Controller,
  Post,
  Body,
  Put,
  Req,
  UseGuards,
  Patch,
  Get,
  UploadedFile,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { extname } from 'path';

export const storage = {
  storage: diskStorage({
    destination: './images',
    filename: (req: IGetUserAuthInfoRequest, file, cb) => {
      console.log({ file }, 'storage');
      const filename: string = req?.user._id + '123';
      const extension: string = extname(file.originalname);

      cb(null, `${filename}${extension}`);
    },
  }),
};

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
    return this.usersService.addCategoryToUser(req.user._id, body, req);
  }

  @Patch('/removeCategoryToUser')
  @UseGuards(AuthGuard)
  removeCategoryToUser(@Req() req: IGetUserAuthInfoRequest, @Body() body: any) {
    return this.usersService.removeCategoryToUser(req.user._id, body);
  }

  @Get('/getAllUsers')
  @UseGuards(AuthGuard)
  findAllUsers(@Req() req: IGetUserAuthInfoRequest) {
    return this.usersService.findAll(req);
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
  @UseInterceptors(FileInterceptor('profileImage', storage))
  updateProfile(
    @Req() req: IGetUserAuthInfoRequest,
    @UploadedFile() file: Express.Multer.File | any,
  ) {
    let body: UpdateDTO = req.body;

    console.log({ body });

    console.log({ file }, 'asdfa');
    if (file) {
      console.log({ file }, 'asdfa');
      // body.profileImage = `http://${req.get('host')}/${file?.filename}`;
    }

    return this.usersService.findOneAndUpdate({ email: req.user.email }, body);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: IGetUserAuthInfoRequest) {
    const { deviceToken } = req.body;
    return this.usersService.logout(req, { deviceToken });
  }
}
