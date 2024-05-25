import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from '@prisma/client';
import { PatchReportDto } from '../dto/PatchReport.dto';
import { CreateReportDto } from '../dto/CreateReport.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id')
  async getReportById(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    try {
      const report = await this.reportService.getReportById(id);
      if (!report) {
        throw new NotFoundException('Tag not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    try {
      const report = this.reportService.createReport(createReportDto);
      if (!report) {
        throw new NotFoundException('Report not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Delete(':id')
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.reportService.deleteReport(id);
      return { message: 'Report deleted successfully.' };
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchReportDto: PatchReportDto,
  ): Promise<Report> {
    try {
      const report = await this.reportService.updateReport(id, patchReportDto);
      if (!report) {
        throw new NotFoundException('Report not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }
}
