import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityController } from '../controllers/user-activity.controller';
import { UserActivityService } from '../services/user-activity.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserActivityController', () => {
  let controller: UserActivityController;
  let service: UserActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActivityController],
      providers: [
        UserActivityService,
        {
          provide: PrismaService,
          useValue: {
            userActivity: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              deleteMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UserActivityController>(UserActivityController);
    service = module.get<UserActivityService>(UserActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
