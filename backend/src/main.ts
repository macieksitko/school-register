import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import swaggerBootstrap from './bootstraps/swagger.bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { port, corsOrigins } = app
    .get(ConfigService)
    .get<AppConfig['server']>('server');
  app.setGlobalPrefix('api', {
    exclude: ['/auth/login'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.use(helmet());

  const profile = app.get(ConfigService).get<string>('profile');
  if (['dev', 'development'].includes(profile)) {
    swaggerBootstrap(app);
  }

  await app.listen(port);
  const serverUrl = await app.getUrl();
  new Logger('ServerBootstrap').log(`Server listening on ${serverUrl}`);
}

bootstrap();
