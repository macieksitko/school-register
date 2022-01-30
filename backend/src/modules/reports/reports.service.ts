import { Inject, Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { TeacherService } from '../teacher/teacher.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportsError } from './ReportsError';

export interface ReportDetails {
  success: boolean;
  code: number;
  executionTime?: string;
  reportPath?: string;
  error?: Error;
  output: string;
}

@Injectable()
export class ReportsService {
  private logger = new Logger(ReportsService.name);
  private SCRIPT_PATH = join(
    __dirname,
    '..',
    '..',
    '..',
    'pdf_reports_generator',
  );
  private SCRIPT_NAME = 'generate_report.py';

  constructor(@Inject(TeacherService) private teacherService: TeacherService) {}

  public getReportsPath() {
    return this.SCRIPT_PATH;
  }

  public async runReportGeneration({
    teacherAccountId,
    subjectId,
    from,
    to,
  }: GenerateReportDto & { teacherAccountId: string }): Promise<ReportDetails> {
    const { _id: teacherId } = await this.teacherService.findOneByAccountId(
      teacherAccountId,
    );
    const args = [`--teacher ${teacherId}`, `--subject ${subjectId}`];
    if (from !== undefined) {
      args.push(`--from ${from}`);
    }
    if (to !== undefined) {
      args.push(`--to ${to}`);
    }

    const generateReport = spawn(`/usr/bin/python3 ${this.SCRIPT_NAME}`, args, {
      cwd: this.SCRIPT_PATH,
      shell: true,
    });

    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let error: Error;
      generateReport.stdout.on('data', (data) => {
        stdout += data;
      });

      generateReport.stderr.on('data', (data) => {
        stderr += data;
      });

      generateReport.on('error', (err) => {
        error = err;
        this.logger.error(error);
      });

      generateReport.on('close', (code) => {
        const success = code === 0;
        const splittedOutput = stdout?.split('\n');
        success
          ? resolve({
              success,
              code,
              executionTime: splittedOutput[0]?.substring(
                'Report generated in: '.length,
              ),
              reportPath: splittedOutput[1]?.substring(
                'Report saved in: '.length,
              ),
              output: stdout,
            })
          : reject(
              new ReportsError('Failed to generate report', {
                success,
                code,
                error,
                output: stderr || stdout,
              }),
            );
      });
    });
  }
}
