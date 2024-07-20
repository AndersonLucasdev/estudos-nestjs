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
});
