import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class PatchReportDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
