import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Report } from '@prisma/client';
import { ReportStatus } from '@prisma/client';
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
        status: ReportStatus.AWAITING_REVIEW,
      };

      jest.spyOn(service, 'getReportById').mockResolvedValue(mockReport);

      const result = await controller.getReportById(1);
      expect(result).toEqual(mockReport);
    });

    it('should throw NotFoundException if report not found', async () => {
      jest.spyOn(service, 'getReportById').mockResolvedValue(null);

      await expect(controller.getReportById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createReport', () => {
    it('should create a new report', async () => {
      const createReportDto: CreateReportDto = {
        reporterId: 1,
        postId: 1,
        commentId: 1,
        storyId: 1,
        reason: 'Test reason',
      };

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

      jest.spyOn(service, 'createReport').mockResolvedValue(mockReport);

      const result = await controller.createReport(createReportDto);
      expect(result).toEqual(mockReport);
    });

    it('should throw NotFoundException if error occurs during creation', async () => {
      jest
        .spyOn(service, 'createReport')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.createReport({
          reporterId: 1,
          postId: 1,
          commentId: 1,
          storyId: 1,
          reason: 'Test reason',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteReport', () => {
    it('should delete a report by ID', async () => {
      jest.spyOn(service, 'deleteReport').mockResolvedValue(undefined);

      await controller.deleteReport(1);
      expect(service.deleteReport).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if report not found', async () => {
      jest
        .spyOn(service, 'deleteReport')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteReport(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateReport', () => {
    it('should update a report by ID', async () => {
      const patchReportDto: PatchReportDto = {
        status: ReportStatus.RESOLVED,
        reason: 'Test Patch reason',
      };

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

      jest.spyOn(service, 'updateReport').mockResolvedValue(mockReport);

      const result = await controller.updateReport(1, patchReportDto);
      expect(result).toEqual(mockReport);
    });

    it('should throw NotFoundException if report not found', async () => {
      jest.spyOn(service, 'updateReport').mockResolvedValue(null);

      await expect(
        service.updateReport(1, {
          status: ReportStatus.AWAITING_REVIEW,
          reason: 'Updated reason',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
