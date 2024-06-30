import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            GetAllUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all users', async () => {
    const userId = 1;
    const mockUsers = [{ id: 1, username: 'user1' }];
    jest.spyOn(service, 'GetAllUsers').mockResolvedValue(mockUsers);

    const result = await controller.getAllUsers(userId);

    expect(result).toEqual({ user: mockUsers });
    expect(service.GetAllUsers).toHaveBeenCalledWith(userId);
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'user1' };
      jest.spyOn(service, 'GetUserById').mockResolvedValue(mockUser);
  
      const result = await controller.getUserById(userId);
  
      expect(result).toEqual({ user: mockUser });
      expect(service.GetUserById).toHaveBeenCalledWith(userId);
    });
  
    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;
      jest.spyOn(service, 'GetUserById').mockResolvedValue(null);
  
      await expect(controller.getUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      };
      const mockUser = { id: 1, ...createUserDto };
      jest.spyOn(service, 'CreateUser').mockResolvedValue(mockUser);
  
      const result = await controller.createUser(createUserDto);
  
      expect(result).toEqual({ message: 'User created successfully!', user: mockUser });
      expect(service.CreateUser).toHaveBeenCalledWith(createUserDto);
    });
  
    it('should throw NotFoundException if error creating user', async () => {
      const createUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      };
      jest.spyOn(service, 'CreateUser').mockRejectedValue(new Error('Error'));
  
      await expect(controller.createUser(createUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  
});
