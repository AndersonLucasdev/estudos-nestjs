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

  it('should create a feedback', async () => {
    const createFeedbackDto: CreateFeedbackDto = {
      userId: 1,
      content: 'Great app!',
      rating: 5,
    };
    const feedback = { id: 1, ...createFeedbackDto, createdAt: new Date() };
    jest.spyOn(prisma.feedback, 'create').mockResolvedValue(feedback);

    expect(await service.createFeedback(createFeedbackDto)).toEqual(feedback);
  });

  it('should get feedback by id', async () => {
    const feedback = {
      id: 1,
      userId: 1,
      content: 'Great app!',
      rating: 5,
      createdAt: new Date(),
    };
    jest.spyOn(prisma.feedback, 'findUnique').mockResolvedValue(feedback);

    expect(await service.getFeedbackById(1)).toEqual(feedback);
  });

  it('should throw an error if feedback not found by id', async () => {
    jest.spyOn(prisma.feedback, 'findUnique').mockResolvedValue(null);

    await expect(service.getFeedbackById(1)).rejects.toThrow(NotFoundException);
  });

  it('should get all feedbacks', async () => {
    const feedbacks = [
      {
        id: 1,
        userId: 1,
        content: 'Great app!',
        rating: 5,
        createdAt: new Date(),
      },
    ];
    jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue(feedbacks);

    expect(await service.getAllFeedbacks()).toEqual(feedbacks);
  });

  it('should get feedbacks by user id', async () => {
    const feedbacks = [
      {
        id: 1,
        userId: 1,
        content: 'Great app!',
        rating: 5,
        createdAt: new Date(),
      },
    ];
    jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue(feedbacks);

    expect(await service.getFeedbacksByUserId(1)).toEqual(feedbacks);
  });

  it('should update a feedback', async () => {
    const patchFeedbackDto: PatchFeedbackDto = {
      content: 'Updated content',
      rating: 4,
    };
    const feedback = {
      id: 1,
      userId: 1,
      content: 'Updated content',
      rating: 4,
      createdAt: new Date(),
    };
    jest.spyOn(prisma.feedback, 'update').mockResolvedValue(feedback);

    expect(await service.updateFeedback(1, patchFeedbackDto)).toEqual(feedback);
  });

  it('should delete a feedback', async () => {
    const feedback = {
      id: 1,
      userId: 1,
      content: 'Great app!',
      rating: 5,
      createdAt: new Date(),
    };
    jest.spyOn(prisma.feedback, 'findUnique').mockResolvedValue(feedback);
    jest.spyOn(prisma.feedback, 'delete').mockResolvedValue(feedback);

    await service.deleteFeedback(1);
    expect(prisma.feedback.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if feedback not found during delete', async () => {
    jest.spyOn(prisma.feedback, 'findUnique').mockResolvedValue(null);

    await expect(service.deleteFeedback(1)).rejects.toThrow(NotFoundException);
  });
});
