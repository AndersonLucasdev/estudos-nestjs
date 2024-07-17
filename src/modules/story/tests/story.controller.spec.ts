import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from '../controllers/story.controller';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { User } from '@prisma/client';
import { Message } from '@prisma/client';
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

  describe('getStoriesByUserId', () => {
    it('should return stories by user ID', async () => {
      const mockStories: Story[] = [
        {
          id: 1,
          creationDate: new Date(),
          viewCount: 1,
          userId: 1,
          postId: null,
          image: null,
          expirationDate: null,
        },
      ];
      jest.spyOn(service, 'getStoriesByUserId').mockResolvedValue(mockStories);

      const result = await controller.getStoriesByUserId(1);
      expect(result).toEqual(mockStories);
      expect(service.getStoriesByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if stories not found', async () => {
      jest.spyOn(service, 'getStoriesByUserId').mockResolvedValue([]);

      await expect(controller.getStoriesByUserId(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getLast24HoursStoriesByUser', () => {
    it('should return stories from the last 24 hours by user ID', async () => {
      const mockStories: Story[] = [
        {
          id: 1,
          creationDate: new Date(),
          viewCount: 1,
          userId: 1,
          postId: null,
          image: null,
          expirationDate: null,
        },
      ];
      jest
        .spyOn(service, 'getLast24HoursStoriesByUser')
        .mockResolvedValue(mockStories);

      const result = await controller.getLast24HoursStoriesByUser(1);
      expect(result).toEqual(mockStories);
      expect(service.getLast24HoursStoriesByUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if stories not found', async () => {
      jest.spyOn(service, 'getLast24HoursStoriesByUser').mockResolvedValue([]);

      await expect(controller.getLast24HoursStoriesByUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsersWhoViewedStory', () => {
    it('should return users who viewed the story', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One',
      };

      const mockUser: User = {
        id: 1,
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        confirmPassword: createUserDto.confirmPassword,
        name: createUserDto.name,
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        birthDate: new Date(),
        phone: '',
        Bio: '',
        profilePhoto: '',
        connectionId: '',
        gender: Gender.MALE,
      };

      const mockUsers: User[] = [mockUser];
      jest.spyOn(service, 'getUsersWhoViewedStory').mockResolvedValue(mockUsers);

      const result = await controller.getUsersWhoViewedStory(1);
      expect(result).toEqual(mockUsers);
      expect(service.getUsersWhoViewedStory).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if users not found', async () => {
      jest.spyOn(service, 'getUsersWhoViewedStory').mockResolvedValue([]);

      await expect(controller.getUsersWhoViewedStory(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStoryReplies', () => {
    it('should return replies to a story', async () => {
      const mockReplies: Message[] = [
        {
          id: 1,
          creationDate: new Date(),
          senderId: 1,
          recipientId: 2,
          content: 'Teste',
          conversationId: null,
        },
      ];
      jest.spyOn(service, 'getStoryReplies').mockResolvedValue(mockReplies);

      const result = await controller.getStoryReplies(1);
      expect(result).toEqual(mockReplies);
      expect(service.getStoryReplies).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if replies not found', async () => {
      jest.spyOn(service, 'getStoryReplies').mockResolvedValue([]);

      await expect(controller.getStoryReplies(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('incrementViewCount', () => {
    it('should increment the view count of a story', async () => {
      const mockStory: Story = {
        id: 1,
        creationDate: new Date(),
        viewCount: 1,
        userId: 1,
        postId: null,
        image: null,
        expirationDate: null,
      };
      jest.spyOn(service, 'incrementViewCount').mockResolvedValue(mockStory);

      const result = await controller.incrementViewCount(1);
      expect(result).toEqual(mockStory);
      expect(service.incrementViewCount).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if error incrementing views', async () => {
      jest
        .spyOn(service, 'incrementViewCount')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.incrementViewCount(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStory', () => {
    it('should update a story by ID', async () => {
      const patchStoryDto: PatchStoryDto = {
        userId: 1,
        disableComments: null,
        image: null,
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
      jest.spyOn(service, 'UpdateStory').mockResolvedValue(mockStory);

      const result = await controller.updateStory(1, patchStoryDto);
      expect(result).toEqual(mockStory);
      expect(service.UpdateStory).toHaveBeenCalledWith(1, patchStoryDto);
    });

    it('should throw NotFoundException if story not found', async () => {
      const patchStoryDto: PatchStoryDto = {
        userId: 1,
        disableComments: null,
        image: null,
      };
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
