import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Report } from '@prisma/client';
import { CreateReportDto } from '../dto/CreateReport.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { PatchReportDto } from '../dto/PatchReport.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: {
            getReportById: jest.fn(),
            getAllReports: jest.fn(),
            getReportsByUserId: jest.fn(),
            createReport: jest.fn(),
            deleteReport: jest.fn(),
            updateReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  

});
