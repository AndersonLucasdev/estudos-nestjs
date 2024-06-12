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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user activities', async () => {
    const userId = 1;
    const mockActivities = [
      {
        id: 1,
        userId: userId,
        entityId: 1,
        activityType: 'login',
        creationDate: new Date(),
      },
    ];
    jest.spyOn(service, 'getUserActivities').mockResolvedValue(mockActivities);

    const result = await controller.getUserActivities(userId);

    expect(result).toEqual(mockActivities);
    expect(service.getUserActivities).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException if no activities found', async () => {
    const userId = 1;
    jest.spyOn(service, 'getUserActivities').mockResolvedValue([]);

    await expect(controller.getUserActivities(userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get user activity by ID', async () => {
    const activityId = 1;
    const mockActivity = {
      id: activityId,
      userId: 1,
      entityId: 1, // Adicione esta linha
      activityType: 'login',
      creationDate: new Date(),
    };
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue(mockActivity);

    const result = await controller.getUserActivityById(activityId);

    expect(result).toEqual(mockActivity);
    expect(service.getUserActivityById).toHaveBeenCalledWith(activityId);
  });
  it('should throw NotFoundException if activity by ID not found', async () => {
    const activityId = 1;
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue(null);

    await expect(controller.getUserActivityById(activityId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
