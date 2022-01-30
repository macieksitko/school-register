import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  NotFoundException,
  Post,
  Res,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { basename, dirname, extname } from 'path';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportStatus } from './report-status.enum';
import { ReportsService } from './reports.service';
import { ReportsError } from './ReportsError';

@ApiTags('reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);
  constructor(private reportsService: ReportsService) {}

  @Roles(Role.Teacher)
  @Post('/download')
  public getReportStatus(
    @Body() { reportPath }: { reportPath: string },
    @Res({ passthrough: true }) response,
  ): StreamableFile {
    this.logger.log(`Received report ${reportPath} download request`);
    const dir = dirname(reportPath);
    const fileName = basename(reportPath);

    if (dir !== this.reportsService.getReportsPath()) {
      this.logger.error(`Cannot download report from path ${dir}`);
      throw new BadRequestException('This path is not acceptable');
    }

    if (extname(fileName) !== '.pdf') {
      this.logger.error(
        `Cannot download report with extension ${extname(
          fileName,
        )}, only PDF files are allowed`,
      );
      throw new BadRequestException('This file type is not acceptable');
    }

    if (!existsSync(reportPath)) {
      this.logger.error(`Cannot download report, it doesn't exists`);
      throw new NotFoundException(`This report couldn't be found`);
    }

    const file = createReadStream(reportPath);
    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(file);
  }

  @Roles(Role.Teacher)
  @ApiBody({ type: GenerateReportDto })
  @Post()
  public async generateReport(
    @CurrentAccount() currentAccount: any,
    @Body() generateReportDto: GenerateReportDto,
  ) {
    this.logger.log(
      `Received new report generation request by teacher with _id ${currentAccount.userId} for subject with _id ${generateReportDto.subjectId}`,
    );
    try {
      const reportStatus = await this.reportsService.runReportGeneration({
        teacherAccountId: currentAccount.userId,
        ...generateReportDto,
      });
      this.logger.log(
        `Report generated successfully, generation time: ${reportStatus.executionTime}, report saved at path ${reportStatus.reportPath}`,
      );

      return reportStatus;
    } catch (error) {
      if (error instanceof ReportsError) {
        if (
          [
            ReportStatus.TEACHER_NOT_FOUND,
            ReportStatus.SUBJECT_NOT_FOUND,
          ].includes(error.details.code)
        ) {
          this.logger.error(
            `Failed to generate report - ${
              error.details.error || error.details.output
            }`,
          );
          throw new BadRequestException(
            `Specified teacher or subject couldn't be found`,
          );
        }
      }
      throw error;
    }
  }
}
