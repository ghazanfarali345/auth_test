import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // app.enableCors();

  const configService = app.get(ConfigService);
  const firebaseConfig = configService.get('firebase');

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    ...firebaseConfig,
  });

  await app.listen(3000);
}
bootstrap();
