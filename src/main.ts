
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, 'public')));
   app.set('views', __dirname + '/views');
   // set ejs as the view engine
   app.set('view engine', 'ejs');
  await app.listen(3000);
}
bootstrap();