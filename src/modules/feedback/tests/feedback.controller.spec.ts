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
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  
    it('should create a feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = { userId: 1, content: 'Great app!', rating: 5 };
      const feedback = { id: 1, ...createFeedbackDto, createdAt: new Date() };
      jest.spyOn(service, 'createFeedback').mockResolvedValue(feedback);
  
      expect(await controller.createFeedback(createFeedbackDto)).toEqual(feedback);
    });
  
    it('should get feedback by id', async () => {
      const feedback = { id: 1, userId: 1, content: 'Great app!', rating: 5, createdAt: new Date() };
      jest.spyOn(service, 'getFeedbackById').mockResolvedValue(feedback);
  
      expect(await controller.getFeedbackById(1)).toEqual(feedback);
    });
  
    it('should throw an error if feedback not found by id', async () => {
      jest.spyOn(service, 'getFeedbackById').mockRejectedValue(new NotFoundException());
  
      await expect(controller.getFeedbackById(1)).rejects.toThrow(NotFoundException);
    });
  
    it('should get all feedbacks', async () => {
      const feedbacks = [{ id: 1, userId: 1, content: 'Great app!', rating: 5, createdAt: new Date() }];
      jest.spyOn(service, 'getAllFeedbacks').mockResolvedValue(feedbacks);
  
      expect(await controller.getAllFeedbacks()).toEqual(feedbacks);
    });
  
    it('should get feedbacks by user id', async () => {
      const feedbacks = [{ id: 1, userId: 1, content: 'Great app!', rating: 5, createdAt: new Date() }];
      jest.spyOn(service, 'getFeedbacksByUserId').mockResolvedValue(feedbacks);
  
      expect(await controller.getFeedbacksByUserId(1)).toEqual(feedbacks);
    });
  
    it('should update a feedback', async () => {
        const patchFeedbackDto: PatchFeedbackDto = { content: 'Updated content', rating: 4 };
        const feedback = { id: 1, userId: 1, content: 'Updated content', rating: 4, createdAt: new Date() };
        jest.spyOn(service, 'updateFeedback').mockResolvedValue(feedback);
      
        expect(await controller.updateFeedback(1, patchFeedbackDto)).toEqual(feedback);
      });
      
  
    it('should delete a feedback', async () => {
      jest.spyOn(service, 'deleteFeedback').mockResolvedValue();
  
      await expect(controller.deleteFeedback(1)).resolves.not.toThrow();
    });
  
    it('should throw an error if feedback not found during delete', async () => {
      jest.spyOn(service, 'deleteFeedback').mockRejectedValue(new NotFoundException());
  
      await expect(controller.deleteFeedback(1)).rejects.toThrow(NotFoundException);
    });
  });