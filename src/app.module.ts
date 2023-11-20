import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserDevicesModule } from './user-devices/user-devices.module';
import { SocialAuthModule } from './social-auth/social-auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
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
    // HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
