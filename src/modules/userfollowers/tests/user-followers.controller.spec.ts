import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowersController } from '../controllers/user-followers.controller';
import { UserFollowersService } from '../services/user-followers.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserFollowersController', () => {
  let controller: UserFollowersController;
  let service: UserFollowersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFollowersController],
      providers: [
        {
          provide: UserFollowersService,
          useValue: {
            CheckIfFollowing: jest.fn(),
            CountFollowers: jest.fn(),
            CountFollowing: jest.fn(),
            ListCommonFollowers: jest.fn(),
            CreateFollowers: jest.fn(),
            Unfollow: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserFollowersController>(UserFollowersController);
    service = module.get<UserFollowersService>(UserFollowersService);
  });

  it('should check if a user is following another user', async () => {
    jest.spyOn(service, 'CheckIfFollowing').mockResolvedValue(true);
    
    const result = await controller.checkIfFollowing(1, 2);
    
    expect(result).toEqual({ isFollowing: true });
    expect(service.CheckIfFollowing).toHaveBeenCalledWith(1, 2);
  });

  it('should get the count of followers for a specific user', async () => {
    jest.spyOn(service, 'CountFollowers').mockResolvedValue(5);
    
    const result = await controller.countFollowers(1);
    
    expect(result).toEqual({ followersCount: 5 });
    expect(service.CountFollowers).toHaveBeenCalledWith(1);
  });

  it('should get the count of users a specific user is following', async () => {
    jest.spyOn(service, 'CountFollowing').mockResolvedValue(3);
    
    const result = await controller.countFollowing(1);
    
    expect(result).toEqual({ followingCount: 3 });
    expect(service.CountFollowing).toHaveBeenCalledWith(1);
  });

  it('should list common followers between two users', async () => {
    const commonFollowers = [
      { id: 1, user: { id: 1, username: 'user1' } },
      { id: 2, user: { id: 2, username: 'user2' } },
    ];
    jest.spyOn(service, 'ListCommonFollowers').mockResolvedValue(commonFollowers);
    
    const result = await controller.listCommonFollowers(1, 2);
    
    expect(result).toEqual(commonFollowers);
    expect(service.ListCommonFollowers).toHaveBeenCalledWith(1, 2);
  });

  it('should follow a user by creating a follow relationship', async () => {
    const followRelationship = { id: 1, userId: 1, relatedUserId: 2 };
    jest.spyOn(service, 'CreateFollowers').mockResolvedValue(followRelationship);
    
    const result = await controller.followUser(1, 2);
    
    expect(result).toEqual(followRelationship);
    expect(service.CreateFollowers).toHaveBeenCalledWith(1, 2);
  });

  it('should handle conflict when trying to follow a user who is already followed', async () => {
    jest.spyOn(service, 'CreateFollowers').mockRejectedValue(new ConflictException());
    
    try {
      await controller.followUser(1, 2);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should unfollow a user by deleting the follow relationship', async () => {
    const unfollowResult = { id: 1, userId: 1, relatedUserId: 2 };
    jest.spyOn(service, 'Unfollow').mockResolvedValue(unfollowResult);
    
    const result = await controller.unfollowUser(1, 2);
    
    expect(result).toEqual(unfollowResult);
    expect(service.Unfollow).toHaveBeenCalledWith(1, 2);
  });

  it('should handle not found when trying to unfollow a user who is not followed', async () => {
    jest.spyOn(service, 'Unfollow').mockRejectedValue(new NotFoundException());
    
    try {
      await controller.unfollowUser(1, 2);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});
