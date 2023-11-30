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
    console.log(req.user._id);
    let notification = await this.notificationModel.find({ to: req.user._id });

    console.log({ notification });

    return {
      success: true,
      message: 'Notification fetched successfully',
      data: notification,
    };
  }

  findOne(id: number) {
    return 'find one';
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationModel.findOneAndUpdate(
      { _id: id },
      updateNotificationDto,
      { new: true },
    );

    return {
      success: true,
      message: 'Notification updated successfully',
      data: null,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
