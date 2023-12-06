import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { CreatePushNotificationDto } from './dto/create-push-notification.dto';
import { UpdatePushNotificationDto } from './dto/update-push-notification.dto';

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  @Post()
  create(@Body() createPushNotificationDto: CreatePushNotificationDto) {
    return this.pushNotificationsService.create(createPushNotificationDto);
  }

  @Get()
  findAll() {
    return this.pushNotificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pushNotificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePushNotificationDto: UpdatePushNotificationDto) {
    return this.pushNotificationsService.update(+id, updatePushNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pushNotificationsService.remove(+id);
  }
}
