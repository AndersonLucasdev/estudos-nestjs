import { Test, TestingModule } from '@nestjs/testing';
import { PostLikeService } from '../services/post-like.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PostLike } from '@prisma/client';

describe('PostLikeService', () => {
  let service: PostLikeService;
  let prismaService: PrismaService;
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostLikeService,
        {
          provide: PrismaService,
          useValue: {
            postLike: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
            post: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: WebSocketService,
          useValue: {
            sendNotificationToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostLikeService>(PostLikeService);
    prismaService = module.get<PrismaService>(PrismaService);
    webSocketService = module.get<WebSocketService>(WebSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetLikeById', () => {
    it('should return a like by ID', async () => {
      const mockLike: PostLike = { id: 1, userId: 1, postId: 1 };
  
      jest.spyOn(prismaService.postLike, 'findUnique').mockResolvedValue(mockLike);
  
      const result = await service.GetLikeById(1);
      expect(result).toEqual(mockLike);
    });
  
    it('should throw NotFoundException if like not found', async () => {
      jest.spyOn(prismaService.postLike, 'findUnique').mockResolvedValue(null);
  
      await expect(service.GetLikeById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
