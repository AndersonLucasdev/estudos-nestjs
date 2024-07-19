import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../services/report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from '../dto/CreateReport.dto';
import { PatchReportDto } from '../dto/PatchReport.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Report } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('ReportService', () => {
  let service: ReportService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportService, PrismaService, WebSocketService],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
