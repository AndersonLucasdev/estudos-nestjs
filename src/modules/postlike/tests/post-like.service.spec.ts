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

  describe('GetAllLikes', () => {
    it('should return all likes', async () => {
      const mockLikes: PostLike[] = [
        { id: 1, userId: 1, postId: 1 },
        { id: 2, userId: 2, postId: 2 },
      ];
  
      jest.spyOn(prismaService.postLike, 'findMany').mockResolvedValue(mockLikes);
  
      const result = await service.GetAllLikes();
      expect(result).toEqual(mockLikes);
    });
  });

  describe('GetLikesForPost', () => {
    it('should return likes for a post', async () => {
      const mockLikes: PostLike[] = [
        { id: 1, userId: 1, postId: 1 },
        { id: 2, userId: 2, postId: 1 },
      ];
  
      jest.spyOn(prismaService.postLike, 'findMany').mockResolvedValue(mockLikes);
  
      const result = await service.GetLikesForPost(1);
      expect(result).toEqual(mockLikes);
    });
  });
  
  describe('CountLikesForPost', () => {
    it('should return the number of likes for a post', async () => {
      const mockCount = 5;
  
      jest.spyOn(prismaService.postLike, 'count').mockResolvedValue(mockCount);
  
      const result = await service.CountLikesForPost(1);
      expect(result).toBe(mockCount);
    });
  });
  

  describe('CreateLike', () => {
    it('should create a new like', async () => {
      const mockLike: PostLike = { id: 1, userId: 1, postId: 1 };
  
      jest.spyOn(prismaService.postLike, 'create').mockResolvedValue(mockLike);
      
      // Acessa o método privado indiretamente
      jest.spyOn<any, any>(service, 'notifyPostLikeChange').mockImplementation(() => Promise.resolve());
  
      const result = await service.CreateLike(1, 1);
      expect(result).toEqual(mockLike);
      expect(service['notifyPostLikeChange']).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('RemoveLike', () => {
    it('should remove a like', async () => {
      const mockLike: PostLike[] = [{ id: 1, userId: 1, postId: 1 }];
  
      jest.spyOn(prismaService.postLike, 'deleteMany').mockResolvedValue(mockLike);
  
      const result = await service.RemoveLike(1, 1);
      expect(result).toEqual(mockLike[0]);
    });
  
    it('should throw NotFoundException if like not found', async () => {
      jest.spyOn(prismaService.postLike, 'deleteMany').mockResolvedValue([]);
  
      await expect(service.RemoveLike(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('notifyPostLikeChange', () => {
    it('should notify post like change', async () => {
      const mockPost = { id: 1, userId: 1 };
  
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(mockPost);
      jest.spyOn(webSocketService, 'sendNotificationToUser').mockResolvedValue();
  
      await service.notifyPostLikeChange(1, 1);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { userId: true },
      });
      expect(webSocketService.sendNotificationToUser).toHaveBeenCalledWith(1, {
        message: `Alguém curtiu seu post.`,
      });
    });
  
    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);
  
      await expect(service.notifyPostLikeChange(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
