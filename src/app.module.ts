import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { UserDevicesModule } from './user-devices/user-devices.module';
import { SocialAuthModule } from './social-auth/social-auth.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HomeModule } from './home/home.module';
import { StaticContentModule } from './static-content/static-content.module';
import { FaqModule } from './faq/faq.module';
import { CronJob } from './utils/crons';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT as unknown as number,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" <user@gmail.com>', // outgoing email ID
      },
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URL
        : process.env.MONGO_URL_ATLAS,
    ),
    UsersModule,
    RoleModule,
    UserDevicesModule,
    SocialAuthModule,
    CategoriesModule,
    NotificationsModule,
    TransactionsModule,
    HomeModule,
    StaticContentModule,
    FaqModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronJob],
})
export class AppModule {}
