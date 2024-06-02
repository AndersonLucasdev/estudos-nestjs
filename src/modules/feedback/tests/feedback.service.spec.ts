import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { FeedbackService } from '../services/feedback.service';
import { NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from '../dto/CreateFeedback.dto';
import { PatchFeedbackDto } from '../dto/PatchFeedback.dto';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService, PrismaService],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
