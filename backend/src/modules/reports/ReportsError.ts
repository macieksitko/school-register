import { ReportDetails } from './reports.service';

export class ReportsError extends Error {
  public readonly details: ReportDetails;
  constructor(message: string, details: ReportDetails) {
    super(message);
    this.name = 'ReportsError';
    this.details = details;
  }
}
