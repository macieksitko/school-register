import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverPort = app.get(ConfigService).get<number>('server.port');
  app.setGlobalPrefix('/api');
  await app.listen(serverPort);
  const serverUrl = await app.getUrl();
  new Logger('ServerBootstrap').log(`Server listening on ${serverUrl}`);
}
bootstrap();
