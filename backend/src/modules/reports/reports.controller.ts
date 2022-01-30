import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
