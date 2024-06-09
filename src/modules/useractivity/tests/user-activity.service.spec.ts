import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityService } from '../services/user-activity.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserActivityDto } from '../dto/CreateUserActivity.dto';
import { PatchUserActivityDto } from '../dto/PatchUserActivity.dto';
import { UserActivityType } from '@prisma/client';

import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('UserActivityService', () => {
  let service: UserActivityService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UserActivityService>(UserActivityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user activities', async () => {
    const userId = 1;
    const mockActivities = [{ id: 1, userId, entityId: 1, activityType: UserActivityType.LOGIN, creationDate: new Date() }];
    jest.spyOn(prisma.userActivity, 'findMany').mockResolvedValue(mockActivities);

    const result = await service.getUserActivities(userId);

    expect(result).toEqual(mockActivities);
    expect(prisma.userActivity.findMany).toHaveBeenCalledWith({
      where: { userId },
    });
  });

  it('should get user activity by ID', async () => {
    const activityId = 1;
    const mockActivity = { id: activityId, userId: 1, entityId: 1, activityType: 'login', creationDate: new Date() };
    jest.spyOn(prisma.userActivity, 'findUnique').mockResolvedValue(mockActivity);

    const result = await service.getUserActivityById(activityId);

    expect(result).toEqual(mockActivity);
    expect(prisma.userActivity.findUnique).toHaveBeenCalledWith({
      where: { id: activityId },
    });
  });

  it('should throw NotFoundException if activity by ID not found', async () => {
    const activityId = 1;
    jest.spyOn(prisma.userActivity, 'findUnique').mockResolvedValue(null);

    await expect(service.getUserActivityById(activityId)).rejects.toThrow(NotFoundException);
  });

  it('should get user activities by type', async () => {
    const userId = 1;
    const activityType = 'login';
    const mockActivities = [{ id: 1, userId, activityType, creationDate: new Date() }];
    jest.spyOn(prisma.userActivity, 'findMany').mockResolvedValue(mockActivities);

    const result = await service.getUserActivitiesByType(userId, activityType);

    expect(result).toEqual(mockActivities);
    expect(prisma.userActivity.findMany).toHaveBeenCalledWith({
      where: { userId, activityType },
    });
  });

  it('should count user activities by type', async () => {
    const userId = 1;
    const activityType = 'login';
    const count = 5;
    jest.spyOn(prisma.userActivity, 'count').mockResolvedValue(count);

    const result = await service.countUserActivitiesByType(userId, activityType);

    expect(result).toBe(count);
    expect(prisma.userActivity.count).toHaveBeenCalledWith({
      where: { userId, activityType },
    });
  });

  it('should filter user activities by date', async () => {
    const userId = 1;
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const mockActivities = [{ id: 1, userId, activityType: 'login', creationDate: new Date() }];
    jest.spyOn(prisma.userActivity, 'findMany').mockResolvedValue(mockActivities);

    const result = await service.filterUserActivitiesByDate(userId, startDate, endDate);

    expect(result).toEqual(mockActivities);
    expect(prisma.userActivity.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  });

  it('should get recent user activities', async () => {
    const userId = 1;
    const limit = 10;
    const mockActivities = [{ id: 1, userId, activityType: 'login', creationDate: new Date() }];
    jest.spyOn(prisma.userActivity, 'findMany').mockResolvedValue(mockActivities);

    const result = await service.getRecentUserActivities(userId, limit);

    expect(result).toEqual(mockActivities);
    expect(prisma.userActivity.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { creationDate: 'desc' },
      take: limit,
    });
  });

  it('should delete old user activities', async () => {
    const userId = 1;
    const cutoffDate = new Date('2023-01-01');
    jest.spyOn(prisma.userActivity, 'deleteMany').mockResolvedValue({ count: 1 });

    await service.deleteOldUserActivities(userId, cutoffDate);

    expect(prisma.userActivity.deleteMany).toHaveBeenCalledWith({
      where: {
        userId,
        creationDate: { lt: cutoffDate },
      },
    });
  });

  it('should create user activity', async () => {
    const createUserActivityDto = { userId: 1, activityType: 'login', creationDate: new Date() };
    const mockActivity = { id: 1, ...createUserActivityDto };
    jest.spyOn(prisma.userActivity, 'create').mockResolvedValue(mockActivity);

    const result = await service.createUserActivity(createUserActivityDto);

    expect(result).toEqual(mockActivity);
    expect(prisma.userActivity.create).toHaveBeenCalledWith({
      data: createUserActivityDto,
    });
  });

  it('should throw ConflictException if failed to create user activity', async () => {
    const createUserActivityDto = { userId: 1, activityType: 'login', creationDate: new Date() };
    jest.spyOn(prisma.userActivity, 'create').mockRejectedValue(new Error());

    await expect(service.createUserActivity(createUserActivityDto)).rejects.toThrow(ConflictException);
  });

  it('should update user activity', async () => {
    const activityId = 1;
    const patchUserActivityDto = { activityType: 'logout' };
    const mockActivity = { id: activityId, userId: 1, activityType: 'logout', creationDate: new Date() };
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue(mockActivity);
    jest.spyOn(prisma.userActivity, 'update').mockResolvedValue(mockActivity);

    const result = await service.updateUserActivity(activityId, patchUserActivityDto);

    expect(result).toEqual(mockActivity);
    expect(prisma.userActivity.update).toHaveBeenCalledWith({
      where: { id: activityId },
      data: patchUserActivityDto,
    });
  });

  it('should throw BadRequestException if failed to update user activity', async () => {
    const activityId = 1;
    const patchUserActivityDto = { activityType: 'logout' };
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue({ id: activityId, userId: 1, activityType: 'login', creationDate: new Date() });
    jest.spyOn(prisma.userActivity, 'update').mockRejectedValue(new Error());

    await expect(service.updateUserActivity(activityId, patchUserActivityDto)).rejects.toThrow(BadRequestException);
  });

  it('should delete user activity', async () => {
    const activityId = 1;
    const mockActivity = { id: activityId, userId: 1, activityType: 'login', creationDate: new Date() };
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue(mockActivity);
    jest.spyOn(prisma.userActivity, 'delete').mockResolvedValue(mockActivity);

    await service.deleteUserActivity(activityId);

    expect(prisma.userActivity.delete).toHaveBeenCalledWith({
      where: { id: activityId },
    });
  });

  it('should throw BadRequestException if failed to delete user activity', async () => {
    const activityId = 1;
    jest.spyOn(service, 'getUserActivityById').mockResolvedValue({ id: activityId, userId: 1, activityType: 'login', creationDate: new Date() });
    jest.spyOn(prisma.userActivity, 'delete').mockRejectedValue(new Error());

    await expect(service.deleteUserActivity(activityId)).rejects.toThrow(BadRequestException);
  });
});
