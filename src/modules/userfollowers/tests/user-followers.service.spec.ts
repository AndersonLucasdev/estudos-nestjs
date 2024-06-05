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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if a user is following another user', async () => {
    const followerId = 1;
    const followedId = 2;
    const mockFollow = { id: 1, userId: followerId, relatedUserId: followedId };
    jest.spyOn(prisma.userFollowers, 'findFirst').mockResolvedValue(mockFollow);

    const result = await service.CheckIfFollowing(followerId, followedId);

    expect(result).toBe(true);
    expect(prisma.userFollowers.findFirst).toHaveBeenCalledWith({
      where: {
        userId: followerId,
        relatedUserId: followedId,
      },
    });
  });

  it('should return false if a user is not following another user', async () => {
    const followerId = 1;
    const followedId = 2;
    jest.spyOn(prisma.userFollowers, 'findFirst').mockResolvedValue(null);

    const result = await service.CheckIfFollowing(followerId, followedId);

    expect(result).toBe(false);
  });

  it('should count the number of followers for a specific user', async () => {
    const userId = 1;
    jest.spyOn(prisma.userFollowers, 'count').mockResolvedValue(5);

    const result = await service.CountFollowers(userId);

    expect(result).toBe(5);
    expect(prisma.userFollowers.count).toHaveBeenCalledWith({
      where: { relatedUserId: userId },
    });
  });

  it('should count the number of users a specific user is following', async () => {
    const userId = 1;
    jest.spyOn(prisma.userFollowers, 'count').mockResolvedValue(3);

    const result = await service.CountFollowing(userId);

    expect(result).toBe(3);
    expect(prisma.userFollowers.count).toHaveBeenCalledWith({
      where: { userId: userId },
    });
  });

  it('should list common followers between two users', async () => {
    const user1Id = 1;
    const user2Id = 2;
    const commonFollowers = [
      { id: 1, userId: 3, relatedUserId: user1Id, user: { id: 3, username: 'user1' } },
      { id: 2, userId: 4, relatedUserId: user2Id, user: { id: 4, username: 'user2' } },
    ];
    jest.spyOn(prisma.userFollowers, 'findMany').mockResolvedValue(commonFollowers);

    const result = await service.ListCommonFollowers(user1Id, user2Id);

    expect(result).toEqual(commonFollowers);
    expect(prisma.userFollowers.findMany).toHaveBeenCalledWith({
      where: {
        userId: user1Id,
        relatedUserId: user2Id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  });

  it('should create a new follow relationship between users', async () => {
    const userId = 1;
    const relatedUserId = 2;
    const followRelationship = { id: 1, userId, relatedUserId };
    jest.spyOn(prisma.userFollowers, 'create').mockResolvedValue(followRelationship);

    const result = await service.CreateFollowers(userId, relatedUserId);

    expect(result).toEqual(followRelationship);
    expect(prisma.userFollowers.create).toHaveBeenCalledWith({
      data: {
        userId: userId,
        relatedUserId: relatedUserId,
      },
    });
    expect(webSocketService.sendNotificationToUser).toHaveBeenCalledWith(
      relatedUserId,
      { message: 'Seguindo você agora', followerId: userId }
    );
  });

  it('should unfollow a user by deleting the follow relationship', async () => {
    const userId = 1;
    const relatedUserId = 2;
    const unfollowResult = { count: 1 };
    jest.spyOn(prisma.userFollowers, 'deleteMany').mockResolvedValue(unfollowResult);

    const result = await service.Unfollow(userId, relatedUserId);

    expect(result).toEqual(unfollowResult);
    expect(prisma.userFollowers.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: userId,
        relatedUserId: relatedUserId,
      },
    });
  });

  it('should throw a NotFoundException if the follow relationship does not exist', async () => {
    const userId = 1;
    const relatedUserId = 2;
    const unfollowResult = { count: 0 };
    jest.spyOn(prisma.userFollowers, 'deleteMany').mockResolvedValue(unfollowResult);

    await expect(service.Unfollow(userId, relatedUserId)).rejects.toThrow(NotFoundException);
  });
});
