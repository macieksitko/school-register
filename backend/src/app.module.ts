import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getConfig, AppConfig } from './config/configuration';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { username, password, host, port, name } =
          configService.get<AppConfig['database']>('database');
        new Logger('MongoConnection').log(
          `Initializing connection with ${name} database on ${host}:${port}`,
        );
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${name}?ssl=false`,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
