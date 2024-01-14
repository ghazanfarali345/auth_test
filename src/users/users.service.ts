import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

import { UserDocument } from './user.schema';
import { CreateUserDTO } from './dtos/createUser.dto';
import { LoginDTO } from './dtos/loginUser.dto';
import { Utils } from '../utils/utils';
import Omit from '../utils/omit';
import { UpdateUserDTO } from './dtos/updateUser.dto';
import { VerifyUserDTO } from './dtos/verifyUser.dto';
import { IGetUserAuthInfoRequest, genericResponseType } from 'src/interfaces';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Request } from 'express';
// import { LogutDTO } from './dtos/logoutDTO';

let activeTokens = []; // instead this we can use redis as well

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
  }

  async storeUserPayloadInCache(userId: string, payload: any): Promise<void> {
    // Assuming userId is unique for each user
    await this.cacheManager.set(`user_payload_${userId}`, payload); // Set a TTL (time-to-live) as needed
  }

  async getUserPayloadFromCache(userId: string): Promise<any | null> {
    // Assuming userId is unique for each user
    const cachedPayload = await this.cacheManager.get(`user_payload_${userId}`);
    return cachedPayload || null;
  }

  async register(
    userData: CreateUserDTO,
  ): Promise<UserDocument | string | genericResponseType> {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser.data)
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists',
          status: HttpStatus.CONFLICT,
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );

    const hashedPassword = await this.hashPassword(userData.password);
    userData.password = hashedPassword;

    const newUserData = {
      ...userData,
      otp: Utils.OTPGenerator(),
    };

    let user: any = (await this.userModel.create(newUserData))?.toObject();

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
        to: user.email,
        from: 'auth_test@example.com',
        subject: 'Registration Otp',
        text: 'welcome',
        html: `<b>Your registration otp is: ${user.otp}</b>`,
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

  async verifyUser(body: VerifyUserDTO) {
    const email = body.email!.toString();
    const otp = body.otp!.toString();

    const { data: user } = await this.findByEmail(email);

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

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

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
      data: user,
      token,
    };
  }

  async login(req: Request, userData: LoginDTO): Promise<genericResponseType> {
    let user: any = await this.userModel
      .findOne({ email: userData.email })
      .exec();

    if (!user)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    const password = await bcryptjs.compare(userData.password, user.password);

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

    let isUserLoggedIn = await this.cacheManager.get('isLoggedIn');

    console.log({ isUserLoggedIn });

    if (isUserLoggedIn) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'User is already logged in',
          success: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const currentSessionId = req.sessionID;

    console.log(currentSessionId);

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      sessionId: currentSessionId,
    };

    await this.cacheManager.set('user_payload', payload);
    await this.cacheManager.set('isLoggedIn', true, {
      ttl: 100000000000, // this is for testing purpose
    });
    let isUserLoggedIn1 = await this.cacheManager.get('isLoggedIn');
    console.log({ isUserLoggedIn1 });

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    activeTokens.push(token);
    user = Omit(user.toObject(), ['password', 'otp', '__v']);

    return {
      success: true,
      message: 'Login successful',
      data: user,
      token: token as any,
    };
  }

  async findByEmail(email: string): Promise<any> {
    console.log({ email });
    const user: any = await this.userModel.findOne({ email });

    console.log({ user });
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }

  async findOneAndUpdate(filter: UpdateUserDTO, data: any) {
    console.log({ data: data._parts }, 'service');
    const updatedUser = await this.userModel
      .findOneAndUpdate(filter, data, { new: true })
      .exec();
    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async logout() {
    await this.cacheManager.reset();
    await this.cacheManager.set('isLoggedIn', false);
    return {
      success: true,
      message: 'User logged out successfully',
      data: null,
    };
  }
}
