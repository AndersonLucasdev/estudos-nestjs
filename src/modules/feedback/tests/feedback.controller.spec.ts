import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from '../controllers/feedback.controller';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackDto } from '../dto/CreateFeedback.dto';
import { PatchFeedbackDto } from '../dto/PatchFeedback.dto';
import { NotFoundException } from '@nestjs/common';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            getFeedbackById: jest.fn(),
            getAllFeedbacks: jest.fn(),
            getFeedbacksByUserId: jest.fn(),
            createFeedback: jest.fn(),
            updateFeedback: jest.fn(),
            deleteFeedback: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  
});
