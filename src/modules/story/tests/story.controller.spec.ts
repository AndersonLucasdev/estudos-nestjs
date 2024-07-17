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
});
