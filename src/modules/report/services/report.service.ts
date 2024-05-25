import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from '@prisma/client';
import { PatchReportDto } from '../dto/PatchReport.dto';
import { CreateReportDto } from '../dto/CreateReport.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async getReportById(id: number): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report not found`);
    }
    return report;
  }

  async getAllReports(): Promise<Report[]> {
    const report = await this.prisma.report.findMany();
    if (!report) {
      throw new NotFoundException(`Reports not found`);
    }
    return report;
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    const report = await this.prisma.report.findMany({
      where: { reporterId: userId },
    });
    if (!report) {
      throw new NotFoundException(`Report not found`);
    }
    return report;
  }

  async createReport(reportCreateDto: CreateReportDto): Promise<Report> {
    const { reporterId, postId, commentId, storyId, reason } = reportCreateDto;
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        postId,
        commentId,
        storyId,
        reason,
      },
    });
    return report;
  }

  async deleteReport(id: number): Promise<void> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report not found`);
    }
    await this.prisma.report.delete({
      where: { id },
    });
  }

  async updateReport(id: number, reportPatchDto: PatchReportDto): Promise<Report> {
    const { status, reason } = reportPatchDto;
    const report = await this.prisma.report.update({
      where: { id },
      data: { status, reason },
    });
    if (!report) {
      throw new NotFoundException(`Report not found`);
    }
    return report;
  }
}
