import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
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
    const mockUser = {
      id: 1,
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
      password: 'hashed_password',
      confirmPassword: 'hashed_password',
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      birthDate: new Date('2000-01-01'),
      phone: '1234567890',
      Bio: 'This is user one.',
      profilePhoto: 'profile_photo_url',
      connectionId: 'connection_id',
      gender: 'MALE' as Gender,
    };

    const mockUsers = [mockUser];
    jest.spyOn(service, 'GetAllUsers').mockResolvedValue(mockUsers);

    const result = await controller.getAllUsers(userId);

    expect(result).toEqual({ user: mockUsers });
    expect(service.GetAllUsers).toHaveBeenCalledWith(userId);
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const userId = 1;
      const mockUser = {
        id: 1,
        username: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        password: 'hashed_password',
        confirmPassword: 'hashed_password',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        birthDate: new Date('2000-01-01'),
        phone: '1234567890',
        Bio: 'This is user one.',
        profilePhoto: 'profile_photo_url',
        connectionId: 'connection_id',
        gender: 'MALE' as Gender,
      };

      jest.spyOn(service, 'GetUserById').mockResolvedValue(mockUser);

      const result = await controller.getUserById(userId);

      expect(result).toEqual({ user: mockUser });
      expect(service.GetUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;
      jest.spyOn(service, 'GetUserById').mockResolvedValue(null);

      await expect(controller.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'User One',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        birthDate: new Date('2000-01-01'),
        phone: '1234567890',
        Bio: 'This is user one.',
        profilePhoto: 'profile_photo_url',
        connectionId: 'connection_id',
        gender: Gender.MALE,
      };
      const mockUser = { id: 1, ...createUserDto };
      jest.spyOn(service, 'CreateUser').mockResolvedValue(mockUser);
  
      const result = await controller.createUser(createUserDto);
  
      expect(result).toEqual({
        message: 'User created successfully!',
        user: mockUser,
      });
      expect(service.CreateUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw NotFoundException if error creating user', async () => {
      const createUserDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      };
      jest.spyOn(service, 'CreateUser').mockRejectedValue(new Error('Error'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      const mockUser = {
        id: 1,
        username: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        password: 'hashed_password',
        confirmPassword: 'hashed_password',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        birthDate: new Date('2000-01-01'),
        phone: '1234567890',
        Bio: 'This is user one.',
        profilePhoto: 'profile_photo_url',
        connectionId: 'connection_id',
        gender: 'MALE' as Gender,
      };

      jest.spyOn(service, 'DeleteUser').mockResolvedValue(mockUser);

      const result = await controller.deleteUser(userId);

      expect(result).toEqual({
        message: 'User removed successfully!',
        user: mockUser,
      });
      expect(service.DeleteUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if error deleting user', async () => {
      const userId = 1;
      jest.spyOn(service, 'DeleteUser').mockRejectedValue(new Error('Error'));

      await expect(controller.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('patchUser', () => {
    it('should update a user by ID', async () => {
      const userId = 1;
      const patchUserDto = {
        username: 'newUsername',
        email: 'newEmail@example.com',
      };
      const mockUser = { id: userId, ...patchUserDto };
      jest.spyOn(service, 'GetUserById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'PatchUser').mockResolvedValue(mockUser);

      const result = await controller.patchUser(userId, patchUserDto);

      expect(result).toEqual({
        message: 'Usuário atualizado com sucesso!',
        user: mockUser,
      });
      expect(service.GetUserById).toHaveBeenCalledWith(userId);
      expect(service.PatchUser).toHaveBeenCalledWith(userId, patchUserDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;
      const patchUserDto = {
        username: 'newUsername',
        email: 'newEmail@example.com',
      };
      jest.spyOn(service, 'GetUserById').mockResolvedValue(null);

      await expect(controller.patchUser(userId, patchUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email is already in use', async () => {
      const userId = 1;
      const patchUserDto = {
        username: 'newUsername',
        email: 'newEmail@example.com',
      };
      const mockUser = {
        id: userId,
        username: 'user1',
        email: 'oldEmail@example.com',
      };
      const mockExistingUser = {
        id: 2,
        username: 'user2',
        email: 'newEmail@example.com',
      };
      jest.spyOn(service, 'GetUserById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'GetUserByEmail').mockResolvedValue(mockExistingUser);

      await expect(controller.patchUser(userId, patchUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const userId = 1;
      const patchUserDto = {
        password: 'password1',
        confirmPassword: 'password2',
      };
      const mockUser = {
        id: 1,
        username: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        password: 'hashed_password',
        confirmPassword: 'hashed_password',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        birthDate: new Date('2000-01-01'),
        phone: '1234567890',
        Bio: 'This is user one.',
        profilePhoto: 'profile_photo_url',
        connectionId: 'connection_id',
        gender: 'MALE' as Gender,
      };

      jest.spyOn(service, 'GetUserById').mockResolvedValue(mockUser);

      await expect(controller.patchUser(userId, patchUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
