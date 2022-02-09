import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';

import { getConfig, AppConfig } from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './auth/password/password.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { SubjectModule } from './modules/subject/subject.module';
import { CourseModule } from './modules/course/course.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    StudentModule,
    TeacherModule,
    SubjectModule,
    CourseModule,
    ConfigModule.forRoot({
      load: [getConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { prefix, username, password, host, port, name, args } =
          configService.get<AppConfig['database']>('database');
        new Logger('MongoConnection').log(
          `Initializing connection with ${name} database on ${host}:${port}`,
        );
        return {
          uri: `${prefix}://${username}:${password}@${host}${
            prefix.includes('+srv') ? '' : ':' + port
          }/${name}?${args}`,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    PasswordModule,
    AuthModule,
    ReportsModule,
    ThrottlerModule.forRoot({
      ttl: 15 * 60,
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [
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
