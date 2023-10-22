import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { LoginDTO, NewUserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(userData: NewUserDTO): Promise<UserDocument | String> {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser)
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Email already exists' },
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(userData.password);
    userData.password = hashedPassword;

    const user = await this.userModel.create(userData);
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(userData: LoginDTO): Promise<genericResponseType> {
    const user = await this.findByEmail(userData.email);
    if (!user)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Invalid creadentials' },
        HttpStatus.BAD_REQUEST,
      );

    let password = await bcrypt.compare(userData.password, user.password);
    console.log({ password });
    if (!password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid creadentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: user,
      message: 'Login successful',
      success: true,
    };
  }
}
