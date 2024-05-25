import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from '@prisma/client';
import { ReportPatchDto } from '../dto/PatchReport.dto';
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
}
