import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
