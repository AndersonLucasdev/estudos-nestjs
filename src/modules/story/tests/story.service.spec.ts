import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { Story } from '@prisma/client';
import { Message } from '@prisma/client';
import { Gender } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('StoryService', () => {
  let service: StoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
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

    service = module.get<StoryService>(StoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getStoryById', () => {
    it('should return a tag by ID', async () => {
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

      const result = await service.GetStoryById(1);
      expect(result).toEqual({ tag: mockStory });
      expect(service.GetStoryById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(service, 'GetStoryById').mockResolvedValue(null);

      await expect(service.GetStoryById(1)).rejects.toThrow(NotFoundException);
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
      jest.spyOn(prisma.story, 'findMany').mockResolvedValue(mockStories);

      const result = await service.getStoriesByUserId(1);
      expect(result).toEqual(mockStories);
      expect(prisma.story.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
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
      jest.spyOn(prisma.story, 'findMany').mockResolvedValue(mockStories);

      const result = await service.getLast24HoursStoriesByUser(1);
      expect(result).toEqual(mockStories);
      expect(prisma.story.findMany).toHaveBeenCalled();
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
      jest.spyOn(prisma.story, 'update').mockResolvedValue(mockStory);

      const result = await service.incrementViewCount(1);
      expect(result).toEqual(mockStory);
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { viewCount: { increment: 1 } },
      });
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

      const mockUser = { id: 1, ...createUserDto };
      const mockStory: any = { id: 1, user: mockUser };
      jest.spyOn(prisma.story, 'findUnique').mockResolvedValue(mockStory);

      const result = await service.getUsersWhoViewedStory(1);
      expect(result).toEqual([mockUser]);
      expect(prisma.story.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true },
      });
    });

    it('should throw NotFoundException if story or user not found', async () => {
      jest.spyOn(prisma.story, 'findUnique').mockResolvedValue(null);

      await expect(service.getUsersWhoViewedStory(1)).rejects.toThrow(
        NotFoundException,
      );
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
      const mockStory: any = { id: 1, replies: mockReplies };
      jest.spyOn(prisma.story, 'findUnique').mockResolvedValue(mockStory);

      const result = await service.getStoryReplies(1);
      expect(result).toEqual(mockReplies);
      expect(prisma.story.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { replies: true },
      });
    });

    it('should throw NotFoundException if story not found', async () => {
      jest.spyOn(prisma.story, 'findUnique').mockResolvedValue(null);

      await expect(service.getStoryReplies(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('CreateStory', () => {
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
      jest.spyOn(prisma.story, 'create').mockResolvedValue(mockStory);

      const result = await service.CreateStory(createStoryDto);
      expect(result).toEqual(mockStory);
      expect(prisma.story.create).toHaveBeenCalledWith({
        data: {
          ...createStoryDto,
          expirationDate: expect.any(Date),
        },
      });
    });
  });

  describe('DeleteStory', () => {
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
      jest.spyOn(prisma.story, 'delete').mockResolvedValue(mockStory);

      await service.DeleteStory(1);
      expect(prisma.story.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if story not found', async () => {
      jest
        .spyOn(prisma.story, 'delete')
        .mockRejectedValue(new NotFoundException());

      await expect(service.DeleteStory(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateStory', () => {
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
      jest.spyOn(prisma.story, 'update').mockResolvedValue(mockStory);

      const result = await service.UpdateStory(1, patchStoryDto);
      expect(result).toEqual(mockStory);
      expect(prisma.story.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: patchStoryDto,
      });
    });

    it('should throw NotFoundException if story not found', async () => {
      const patchStoryDto: PatchStoryDto = {
        userId: 1,
        disableComments: null,
        image: null,
      };
      jest
        .spyOn(prisma.story, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(service.UpdateStory(1, patchStoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
