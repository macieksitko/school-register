import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerBoostrap from './bootstraps/swagger.bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { databaseBootstrap } from './bootstraps/mongodb.bootstrap';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const serverPort = app.get(ConfigService).get<number>('server.port');
  app.setGlobalPrefix('api', {
    exclude: ['/auth/login'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  swaggerBoostrap(app);
  databaseBootstrap(app);

  await app.listen(serverPort);
  const serverUrl = await app.getUrl();
  new Logger('ServerBootstrap').log(`Server listening on ${serverUrl}`);
}

bootstrap();
