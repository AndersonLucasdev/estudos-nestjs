import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { UserActivityType } from '@prisma/client';
import { NotificationType } from '@prisma/client';

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
});