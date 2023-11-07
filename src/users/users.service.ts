import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './user.schema';
import { CreateUserDTO } from './dtos/createUser.dto';
import { LoginDTO } from './dtos/loginUser.dto';
import { Utils } from '../utils/utils';
import Omit from '../utils/omit';
import { UpdateUserDTO } from './dtos/updateUser.dto';
import { VerifyUserDTO } from './dtos/verifyUser.dto';
import { sendOtpType } from './dtos/enums';
import { SendOtpDTO } from './dtos/sendOTP.dto';
import { ResetPasswordDTO } from './dtos/resetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(
    userData: CreateUserDTO,
  ): Promise<UserDocument | String | genericResponseType> {
    const existingUser = await this.findByEmail(userData.email);

    console.log({ userData });

    if (existingUser)
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists',
          status: HttpStatus.CONFLICT,
          data: null,
        },
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(userData.password);
    userData.password = hashedPassword;

    let newUserData = {
      ...userData,
      otp: Utils.OTPGenerator(),
    };

    console.log(newUserData);
    let user: any = (await this.userModel.create(newUserData)).toObject();

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'Something went wrong',
          status: HttpStatus.BAD_REQUEST,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.mailerService
      .sendMail({
        to: user.email, // List of receivers email address
        from: 'budgetpie@example.com', // Senders email address
        subject: 'Registration Otp', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Your registration otp is: ${user.otp}</b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
    user = Omit(user, ['password', 'otp', '__v']);

    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  verifyUser = async (body: VerifyUserDTO) => {
    const email = body.email!.toString();
    const otp = body.otp!.toString();

    const user = await this.findByEmail(email);

    if (!user)
      throw new HttpException(
        {
          success: false,
          message: 'Email not found',
          status: HttpStatus.BAD_REQUEST,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );

    if (user.otp !== otp)
      throw new HttpException(
        {
          success: false,
          message: 'Invalid otp',
          status: HttpStatus.BAD_REQUEST,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );

    const updateUser = await this.findOneAndUpdate(
      { email },
      {
        isVerified: true,
        otp: '',
      },
    );

    if (!updateUser)
      throw new HttpException(
        {
          success: false,
          message: 'Internal server error ',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      success: true,
      message: 'User verified successfully',
      data: null,
    };
  };

  async login(userData: LoginDTO): Promise<genericResponseType> {
    let user: any = await this.findByEmail(userData.email);
    if (!user)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    let password = await bcrypt.compare(userData.password, user.password);

    if (!password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    let token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    user = Omit(user.toObject(), ['password', 'otp', '__v']);

    return {
      success: true,
      message: 'Login successful',
      data: user,
      token: token as any,
    };
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneAndUpdate(filter: UpdateUserDTO, data: UpdateUserDTO) {
    return this.userModel.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  async sendOtp(body: SendOtpDTO) {
    console.log({ body });
    let user: any = await this.findByEmail(body.email);

    if (!user)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Email not found' },
        HttpStatus.BAD_REQUEST,
      );

    let otp = Utils.OTPGenerator();
    let result;
    if (body.type === sendOtpType.REGISTER_USER) {
      result = await this.mailerService.sendMail({
        to: body.email, // List of receivers email address
        from: 'budgetpie@example.com', // Senders email address
        subject: 'Registration Otp', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Your registration otp is: ${otp}</b>`, // HTML body content
      });
    }

    if (body.type === sendOtpType.FORGOT_PASSWORD) {
      result = await this.mailerService.sendMail({
        to: body.email, // List of receivers email address
        from: 'budgetpie@example.com', // Senders email address
        subject: 'Forgot Password Otp', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Your password recovery otp is: ${otp}</b>`, // HTML body content
      });
    }

    if (result.accepted.length) {
      return {
        success: true,
        message: 'Otp sent successfully',
        data: null,
      };
    }
  }

  async resetPassword(body: ResetPasswordDTO) {
    console.log({ body });
    let user: any = await this.findByEmail(body.email);

    if (!user)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Email not found' },
        HttpStatus.BAD_REQUEST,
      );

    let password = await bcrypt.compare(body.password, user.password);

    if (password)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'New password must be different from old password',
        },
        HttpStatus.FORBIDDEN,
      );

    const hashedPassword = await this.hashPassword(body.password);

    let updatedUser = await this.findOneAndUpdate(
      { email: body.email },
      { password: hashedPassword },
    );

    if (updatedUser) {
      return {
        success: true,
        message: 'Password updated successfully',
        data: null,
      };
    }
  }
}
