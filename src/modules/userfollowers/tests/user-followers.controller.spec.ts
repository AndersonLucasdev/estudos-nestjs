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

});
