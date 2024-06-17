import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityController } from '../controllers/user-activity.controller';
import { UserActivityService } from '../services/user-activity.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UserActivityType } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

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
        activityType: UserActivityType.POST_CREATED,
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
      entityId: 1,
      activityType: UserActivityType.POST_CREATED,
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

  it('should get user activities by type', async () => {
    const userId = 1;
    const activityType = 'login';
    const mockActivities = [
      {
        id: 1,
        userId,
        activityType: UserActivityType.POST_CREATED,
        creationDate: new Date(),
        entityId: 1,
      },
    ];
    jest
      .spyOn(service, 'getUserActivitiesByType')
      .mockResolvedValue(mockActivities);

    const result = await controller.getUserActivitiesByType(
      userId,
      UserActivityType.POST_CREATED,
    );

    expect(result).toEqual(mockActivities);
    expect(service.getUserActivitiesByType).toHaveBeenCalledWith(
      userId,
      activityType,
    );
  });

  it('should count user activities by type', async () => {
    const userId = 1;
    const activityType = 'login';
    const mockCount = 5;
    jest
      .spyOn(service, 'countUserActivitiesByType')
      .mockResolvedValue(mockCount);

    const result = await controller.countUserActivitiesByType(
      userId,
      UserActivityType.POST_CREATED,
    );

    expect(result).toEqual(mockCount);
    expect(service.countUserActivitiesByType).toHaveBeenCalledWith(
      userId,
      activityType,
    );
  });

  it('should filter user activities by date', async () => {
    const userId = 1;
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const mockActivities = [
      {
        id: 1,
        userId,
        activityType: UserActivityType.POST_CREATED,
        creationDate: new Date(),
        entityId: 1,
      },
    ];
    jest
      .spyOn(service, 'filterUserActivitiesByDate')
      .mockResolvedValue(mockActivities);

    const result = await controller.filterUserActivitiesByDate(
      userId,
      startDate,
      endDate,
    );

    expect(result).toEqual(mockActivities);
    expect(service.filterUserActivitiesByDate).toHaveBeenCalledWith(
      userId,
      startDate,
      endDate,
    );
  });

  it('should get recent user activities', async () => {
    const userId = 1;
    const limit = 10;
    const mockActivities = [
      {
        id: 1,
        userId,
        activityType: UserActivityType.POST_CREATED,
        creationDate: new Date(),
        entityId: 1,
      },,
    ];
    jest
      .spyOn(service, 'getRecentUserActivities')
      .mockResolvedValue(mockActivities);

    const result = await controller.getRecentUserActivities(userId, limit);

    expect(result).toEqual(mockActivities);
    expect(service.getRecentUserActivities).toHaveBeenCalledWith(userId, limit);
  });

  it('should delete old user activities', async () => {
    const userId = 1;
    const cutoffDate = new Date('2023-01-01');
    jest.spyOn(service, 'deleteOldUserActivities').mockResolvedValue(); 

    await controller.deleteOldUserActivities(userId, cutoffDate);

    expect(service.deleteOldUserActivities).toHaveBeenCalledWith(
      userId,
      cutoffDate,
    );
});

it('should create user activity', async () => {
  const userId = 1; // Declare the userId variable
  const createUserActivityDto = {
    id: 1,
    userId,
    activityType: UserActivityType.POST_CREATED,
    creationDate: new Date(),
    entityId: 1,
  };
  const mockActivity = { id: 1, ...createUserActivityDto };
  jest.spyOn(service, 'createUserActivity').mockResolvedValue(mockActivity);

  const result = await controller.createUserActivity(createUserActivityDto);

  expect(result).toEqual(mockActivity);
  expect(service.createUserActivity).toHaveBeenCalledWith(createUserActivityDto);
});

  it('should throw ConflictException if create user activity fails', async () => {
    const createUserActivityDto = {
      userId: 1,
      activityType: 'login',
      creationDate: new Date(),
    };
    jest
      .spyOn(service, 'createUserActivity')
      .mockRejectedValue(new ConflictException());

    await expect(
      controller.createUserActivity(createUserActivityDto),
    ).rejects.toThrow(ConflictException);
  });

  it('should update user activity', async () => {
    const activityId = 1;
    const patchUserActivityDto = { activityType: 'logout' };
    const mockActivity = {
      id: activityId,
      userId: 1,
      ...patchUserActivityDto,
      creationDate: new Date(),
    };
    jest.spyOn(service, 'updateUserActivity').mockResolvedValue(mockActivity);

    const result = await controller.updateUserActivity(
      activityId,
      patchUserActivityDto,
    );

    expect(result).toEqual(mockActivity);
    expect(service.updateUserActivity).toHaveBeenCalledWith(
      activityId,
      patchUserActivityDto,
    );
  });

  it('should throw BadRequestException if update user activity fails', async () => {
    const activityId = 1;
    const patchUserActivityDto = { activityType: 'logout' };
    jest
      .spyOn(service, 'updateUserActivity')
      .mockRejectedValue(new BadRequestException());

    await expect(
      controller.updateUserActivity(activityId, patchUserActivityDto),
    ).rejects.toThrow(BadRequestException);
  });
});
