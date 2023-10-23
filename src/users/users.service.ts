import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDTO } from './dtos/createUser.dto';
import { LoginDTO } from './dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Utils } from '../utils/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(
    userData: CreateUserDTO,
  ): Promise<UserDocument | String | genericResponseType> {
    const existingUser = await this.findByEmail(userData.email);

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
    const user = await this.userModel.create(newUserData);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(userData: LoginDTO): Promise<genericResponseType> {
    const user = await this.findByEmail(userData.email);
    if (!user)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Invalid credentials' },
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

    return {
      success: true,
      message: 'Login successful',
      data: user,
      token: token as any,
    };
  }
}
