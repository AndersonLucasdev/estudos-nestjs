import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { UserActivityType } from '@prisma/client';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            block: {
              findMany: jest.fn(),
            },
            userFollowers: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: WebSocketService,
          useValue: {
            addUserConnection: jest.fn(),
            removeUserConnection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    webSocketService = module.get<WebSocketService>(WebSocketService);
  });

  describe('GetAllUsers', () => {
    it('should return all users excluding blocked users', async () => {
      const userId = 1;
      const blockedUserIds = [2, 3];
      const mockUsers = [
        { id: 4, username: 'user4' },
        { id: 5, username: 'user5' },
      ];

      prisma.block.findMany = jest.fn().mockResolvedValue(blockedUserIds.map(id => ({ blockedUserId: id })));
      prisma.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      const result = await service.GetAllUsers(userId);

      expect(result).toEqual(mockUsers);
      expect(prisma.block.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(prisma.user.findMany).toHaveBeenCalledWith({ where: { NOT: { id: { in: blockedUserIds } } } });
    });

    it('should throw NotFoundException if no users found', async () => {
      const userId = 1;
      const blockedUserIds = [2, 3];

      prisma.block.findMany = jest.fn().mockResolvedValue(blockedUserIds.map(id => ({ blockedUserId: id })));
      prisma.user.findMany = jest.fn().mockResolvedValue([]);

      await expect(service.GetAllUsers(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetUserById', () => {
    it('should return user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'user1' };

      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.GetUserById(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;

      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.GetUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('CreateUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One'
      };
      const mockUser = { id: 1, ...createUserDto };

      prisma.user.findFirst = jest.fn().mockResolvedValue(null);
      prisma.user.create = jest.fn().mockResolvedValue(mockUser);
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      const addUserConnectionSpy = jest.spyOn(webSocketService, 'addUserConnection').mockImplementation();

      const result = await service.CreateUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: createUserDto.email.trim() } });
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { username: createUserDto.username.trim() } });
      expect(bcryptHashSpy).toHaveBeenCalledWith(createUserDto.password.trim(), 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          email: createUserDto.email.trim(),
          username: createUserDto.username.trim(),
          password: 'hashedPassword',
        },
      });
      expect(addUserConnectionSpy).toHaveBeenCalledWith(mockUser.id, mockUser.connectionId);
    });

    it('should throw ConflictException if email is already in use', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One'
      };
      const existingUser = { id: 1, ...createUserDto };

      prisma.user.findFirst = jest.fn().mockResolvedValue(existingUser);

      await expect(service.CreateUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if username is already in use', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One'
      };
      const existingUser = { id: 1, ...createUserDto };

      prisma.user.findFirst = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(existingUser);

      await expect(service.CreateUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'differentPassword',
        name: 'User One'
      };

      await expect(service.CreateUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('DeleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'user1' };

      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.delete = jest.fn().mockResolvedValue(mockUser);
      const removeUserConnectionSpy = jest.spyOn(webSocketService, 'removeUserConnection').mockImplementation();

      const result = await service.DeleteUser(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
      expect(removeUserConnectionSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;

      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.DeleteUser(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('PatchUser', () => {
    it('should update a user by ID', async () => {
      const userId = 1;
      const patchUserDto: PatchUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One',
      };
      const mockUser = { id: userId, username: 'user1', password: 'hashedPassword' };

      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(mockUser);
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.PatchUser(userId, patchUserDto);

    });
  });
});