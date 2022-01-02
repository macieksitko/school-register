import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getConfig, AppConfig } from './config/configuration';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './auth/password/password.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    StudentModule,
    TeacherModule,
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
    PasswordModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
