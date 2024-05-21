import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class CreateReportDto {
  @IsInt()
  reporterId: number;

  @IsInt()
  @IsOptional()
  postId?: number;

  @IsInt()
  @IsOptional()
  commentId?: number;

  @IsInt()
  @IsOptional()
  storyId?: number;

  @IsString()
  reason: string;

  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @IsOptional()
  createdAt?: Date;
}
