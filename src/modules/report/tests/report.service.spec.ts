import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../services/report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from '../dto/CreateReport.dto';
import { PatchReportDto } from '../dto/PatchReport.dto';
import { NotificationType, ReportStatus } from '@prisma/client';
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
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: {
            Story: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: WebSocketService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReportById', () => {
    it('should return a report by ID', async () => {
      const mockReport: Report = {
        id: 1,
        reporterId: 1,
        reason: 'Test reason',
        createdAt: new Date(),
        postId: null,
        commentId: null,
        storyId: null,
        status: ReportStatus.AWAITING_REVIEW
      };
  
      jest.spyOn(prisma.report, 'findUnique').mockResolvedValue(mockReport);
  
      const result = await service.getReportById(1);
      expect(result).toEqual(mockReport);
    });
  
    it('should throw NotFoundException if report not found', async () => {
      jest.spyOn(prisma.report, 'findUnique').mockResolvedValue(null);
  
      await expect(service.getReportById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
