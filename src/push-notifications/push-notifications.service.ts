import { Injectable } from '@nestjs/common';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';
import { UpdatePushNotificationDto } from './dto/update-push-notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationsService {
  create(createPushNotificationDto: CreatePushNotificationDto) {
    return 'This action adds a new pushNotification';
  }

  findAll() {
    return `This action returns all pushNotifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pushNotification`;
  }

  update(id: number, updatePushNotificationDto: UpdatePushNotificationDto) {
    return `This action updates a #${id} pushNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} pushNotification`;
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
