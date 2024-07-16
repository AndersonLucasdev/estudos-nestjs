import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Story } from '@prisma/client';
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
            expirationDate: null
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
});