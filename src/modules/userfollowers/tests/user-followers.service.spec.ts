import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowersService } from '../services/user-followers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { NotFoundException } from '@nestjs/common';

describe('UserFollowersService', () => {
  let service: UserFollowersService;
  let prisma: PrismaService;
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFollowersService,
        {
          provide: PrismaService,
          useValue: {
            userFollowers: {
              findFirst: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
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

    service = module.get<UserFollowersService>(UserFollowersService);
    prisma = module.get<PrismaService>(PrismaService);
    webSocketService = module.get<WebSocketService>(WebSocketService);
  });
});
