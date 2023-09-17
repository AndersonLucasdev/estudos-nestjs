import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/modules/user/services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { PatchUserDto } from 'src/modules/user/dto/PatchUser.dto';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { Gender } from '@prisma/client';
import Follower from 'src/modules/user/interface/follower.interface';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, WebSocketService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    webSocketService = module.get<WebSocketService>(WebSocketService);
  });

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    confirmPassword: 'hashedPassword',
    name: 'Test User',
    Bio: 'Bio information',
    phone: '123456789',
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    gender: 'MALE',
    birthDate: new Date(),
    profilePhoto: 'path/to/photo',
    connectionId: 'connectionId',
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    confirmPassword: 'password123',
    name: 'Test User',
    Bio: 'Bio information',
    phone: '123456789',
    gender: 'MALE',
    birthDate: new Date(),
  };

  const mockPatchUserDto: PatchUserDto = {
    password: 'newPassword123',
    confirmPassword: 'newPassword123',
    name: 'New Test User',
    Bio: 'New Bio information',
    email: 'newtest@example.com',
    phone: '987654321',
    gender: 'FEMALE',
    birthDate: new Date(),
    profilePhoto: 'new/path/to/photo',
    connectionId: 'newConnectionId',
  };

  describe('GetAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.GetAllUsers();

      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      try {
        await service.GetAllUsers();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('GetUserById', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.GetUserById(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.GetUserById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('GetUserByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await service.GetUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return null if user email not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.GetUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('GetUserByUsername', () => {
    it('should return a user by username', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await service.GetUserByUsername('testuser');

      expect(result).toEqual(mockUser);
    });

    it('should return null if user username not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      const result = await service.GetUserByUsername('nonexistentuser');

      expect(result).toBeNull();
    });
  });

  describe('GetUsersByUsername', () => {
    it('should return an array of users with matching username', async () => {
      const users: User[] = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.GetUsersByUsername('testuser');

      expect(result).toEqual(users);
    });

    it('should return an empty array if no matching users found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      const result = await service.GetUsersByUsername('nonexistentuser');

      expect(result).toEqual([]);
    });
  });

  describe('GetUsersWithMostLikes', () => {
    it('should return an array of users with most likes', async () => {
      const usersWithMostLikes: User[] = [mockUser];
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue(usersWithMostLikes);

      const result = await service.GetUsersWithMostLikes();

      expect(result).toEqual(usersWithMostLikes);
    });

    it('should throw NotFoundException if no users with likes found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      try {
        await service.GetUsersWithMostLikes();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('GetUsersWithRecentActivity', () => {
    it('should return an array of users with recent activity', async () => {
      const usersWithRecentActivity: User[] = [mockUser];
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue(usersWithRecentActivity);

      const result = await service.GetUsersWithRecentActivity(7);

      expect(result).toEqual(usersWithRecentActivity);
    });

    it('should throw NotFoundException if no users with recent activity found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      try {
        await service.GetUsersWithRecentActivity(7);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('ListFollowers', () => {
    it('should return an array of followers for a user', async () => {
      const followersData = [{ id: 1, userId: 1, relatedUserId: 2 }];
      const followers: Follower[] = followersData.map((followerData) => ({
        id: followerData.id,
        userId: followerData.userId,
        relatedUserId: followerData.relatedUserId,
      }));

      jest
        .spyOn(prismaService.userFollowers, 'findMany')
        .mockResolvedValue(followersData);

      const result = await service.ListFollowers(1);

      expect(result).toEqual(followers);
    });

    it('should return an empty array if no followers found for a user', async () => {
      jest.spyOn(prismaService.userFollowers, 'findMany').mockResolvedValue([]);

      const result = await service.ListFollowers(1);

      expect(result).toEqual([]);
    });
  });

  describe('ListFollowing', () => {
    it('should return an array of users that a user is following', async () => {
      const followingData = [
        {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          Bio: 'Bio information',
          email: 'test@example.com',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          phone: '123456789',
          gender: 'male' as Gender,
          birthDate: new Date(),
          profilePhoto: 'path/to/photo',
          connectionId: 'connectionId',
          creationDate: new Date(),
          lastUpdateDate: new Date(),
        },
      ];

      jest.spyOn(prismaService.userFollowers, 'findMany').mockResolvedValue(
        followingData.map((userData) => ({
          id: 1,
          userId: 1,
          relatedUserId: userData.id,
        })),
      );

      const result = await service.ListFollowing(1);

      expect(result).toEqual(followingData);
    });

    it('should return an empty array if no users are being followed by a user', async () => {
      jest.spyOn(prismaService.userFollowers, 'findMany').mockResolvedValue([]);

      const result = await service.ListFollowing(1);

      expect(result).toEqual([]);
    });
  });

  describe('CreateUser', () => {
    it('should create a new user', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest
        .spyOn(webSocketService, 'addUserConnection')
        .mockImplementation(() => {});

      const result = await service.CreateUser(mockCreateUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email is already in use', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      try {
        await service.CreateUser(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw ConflictException if username is already in use', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      try {
        await service.CreateUser(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const createUserDto: CreateUserDto = {
        ...mockCreateUserDto,
        confirmPassword: 'password456',
      };

      try {
        await service.CreateUser(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('PatchUser', () => {
    it('should update a user by ID', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword');

      const result = await service.PatchUser(1, mockPatchUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.PatchUser(1, mockPatchUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('DeleteUser', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser);
      jest
        .spyOn(webSocketService, 'removeUserConnection')
        .mockImplementation(() => {});

      const result = await service.DeleteUser(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.DeleteUser(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
