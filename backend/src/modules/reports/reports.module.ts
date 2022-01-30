import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [TeacherModule],
})
export class ReportsModule {}
