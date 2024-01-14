import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as session from 'express-session';
import { AppModule } from './app.module';

import * as connectRedis from 'connect-redis';
import { createClient } from 'redis';
let redisClient = createClient();
const RedisStore = connectRedis(session);

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
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    }),
  );
  const configService = app.get(ConfigService);
  const firebaseConfig = configService.get('firebase');

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    ...firebaseConfig,
  });

  await app.listen(3000);
}
bootstrap();
