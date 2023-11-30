import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDocument } from './notification.schema';
import { IGetUserAuthInfoRequest } from 'src/interfaces';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    await this.notificationModel.create(createNotificationDto);
    return {
      success: true,
      message: 'Notification created successfully',
      data: null,
    };
  }

  async findAll(req: IGetUserAuthInfoRequest) {
    let notification = await this.notificationModel.find({ to: req.user._id });

    if (notification.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'No data found',
          success: false,
        },
        HttpStatus.NO_CONTENT,
      );
    }

    return {
      success: true,
      message: 'Notification fetched successfully',
      data: notification,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
