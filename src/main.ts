import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  
  // Enable CORS
  app.use(cors());
  await app.listen(8010);
}
bootstrap();
