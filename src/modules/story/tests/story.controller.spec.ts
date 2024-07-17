import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from '../controllers/story.controller';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
import { Story } from '@prisma/client';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('StoryController', () => {
  let controller: StoryController;
  let service: StoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [StoryService, PrismaService, WebSocketService],
    }).compile();

    controller = module.get<StoryController>(StoryController);
    service = module.get<StoryService>(StoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStoryById', () => {
    it('should return a story by ID', async () => {
      const mockStory: Story = {
        id: 1,
        creationDate: new Date(),
        viewCount: 1,
        userId: 1,
        postId: null,
        image: null,
        expirationDate: null,
      };
      jest.spyOn(service, 'GetStoryById').mockResolvedValue(mockStory);

      const result = await controller.getStoryById(1);
      expect(result).toEqual(mockStory);
      expect(service.GetStoryById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if story not found', async () => {
      jest
        .spyOn(service, 'GetStoryById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getStoryById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createStory', () => {
    it('should create a new story', async () => {
      const createStoryDto: CreateStoryDto = {
        userId: 1,
        postId: null,
        image: null,
        creationDate: new Date(),
        viewCount: 1,
      };
      const mockStory: Story = {
        id: 1,
        creationDate: new Date(),
        viewCount: 1,
        userId: 1,
        postId: null,
        image: null,
        expirationDate: null,
      };
      jest.spyOn(service, 'CreateStory').mockResolvedValue(mockStory);

      const result = await controller.createStory(createStoryDto);
      expect(result).toEqual(mockStory);
      expect(service.CreateStory).toHaveBeenCalledWith(createStoryDto);
    });

    it('should throw ConflictException if error creating story', async () => {
      const createStoryDto: CreateStoryDto = {
        userId: 1,
        postId: null,
        image: null,
        creationDate: new Date(),
        viewCount: 1,
      };
      jest
        .spyOn(service, 'CreateStory')
        .mockRejectedValue(new ConflictException());

      await expect(controller.createStory(createStoryDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateStory', () => {
    it('should update a story by ID', async () => {
      const patchStoryDto: PatchStoryDto = { viewCount: 10 };
      const mockStory: Story = {
        id: 1,
        creationDate: new Date(),
        viewCount: 1,
        userId: 1,
        postId: null,
        image: null,
        expirationDate: null,
      };
      jest.spyOn(service, 'UpdateStory').mockResolvedValue(mockStory);

      const result = await controller.updateStory(1, patchStoryDto);
      expect(result).toEqual(mockStory);
      expect(service.UpdateStory).toHaveBeenCalledWith(1, patchStoryDto);
    });

    it('should throw NotFoundException if story not found', async () => {
      const patchStoryDto: PatchStoryDto = { viewCount: 10 };
      jest
        .spyOn(service, 'UpdateStory')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.updateStory(1, patchStoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteStory', () => {
    it('should delete a story by ID', async () => {
      const mockStory: Story = {
        id: 1,
        creationDate: new Date(),
        viewCount: 1,
        userId: 1,
        postId: null,
        image: null,
        expirationDate: null,
      };
      jest.spyOn(service, 'DeleteStory').mockResolvedValue();
      jest
        .spyOn(service, 'GetStoryById')
        .mockRejectedValue(new NotFoundException());

      await controller.deleteStory(1);
      expect(service.DeleteStory).toHaveBeenCalledWith(1);
      expect(service.GetStoryById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if story not found after deletion', async () => {
      jest
        .spyOn(service, 'DeleteStory')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteStory(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
