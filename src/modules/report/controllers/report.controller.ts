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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Report')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiParam({ name: 'id', description: 'ID of the report', type: Number })
  @ApiResponse({ status: 200, description: 'report found successfully.' })
  @ApiResponse({ status: 404, description: 'report not found.' })
  async getReportById(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    try {
      const report = await this.reportService.getReportById(id);
      if (!report) {
        throw new NotFoundException('Report not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Get()
  async getAllReports(): Promise<Report[]> {
    try {
      const report = await this.reportService.getAllReports();
      if (!report) {
        throw new NotFoundException('Report not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Get('user/:userId')
  async getReportsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Report[]> {
    try {
      const report = await this.reportService.getReportsByUserId(userId);
      if (!report) {
        throw new NotFoundException('Report not found.');
      }
      return report;
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiBody({ type: CreateReportDto })
  @ApiResponse({ status: 201, description: 'Report created successfully.' })
  @ApiResponse({ status: 400, description: 'Error creating report.' })
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
  @ApiOperation({ summary: 'Delete a report by ID' })
  @ApiParam({ name: 'id', description: 'ID of the report', type: Number })
  @ApiResponse({ status: 200, description: 'Report removed successfully.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.reportService.deleteReport(id);
      return { message: 'Report deleted successfully.' };
    } catch (error) {
      throw new NotFoundException('Report not found.');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report by ID' })
  @ApiParam({ name: 'id', description: 'ID of the report', type: Number })
  @ApiBody({ type: PatchReportDto })
  @ApiResponse({ status: 200, description: 'Report updated successfully.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
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
