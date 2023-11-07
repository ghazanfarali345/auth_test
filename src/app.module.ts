import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
        from: '"nest-modules" <user@outlook.com>', // outgoing email ID
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
