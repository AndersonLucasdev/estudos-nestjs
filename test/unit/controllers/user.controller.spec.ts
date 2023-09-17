import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { PatchUserDto } from 'src/modules/user/dto/PatchUser.dto';
import { Gender } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';


describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [];
      jest.spyOn(userService, 'GetAllUsers').mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toEqual({ user: users });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const user = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        Bio: 'Bio information',
        email: 'test@example.com',
        password: 'hashedPassword',
        confirmPassword: 'hashedPassword',
        phone: '123456789',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        gender: 'male' as Gender,
        birthDate: new Date(),
        profilePhoto: 'path/to/photo',
        connectionId: 'connectionId',
      };
      jest.spyOn(userService, 'GetUserById').mockResolvedValue(user);
  
      const result = await controller.getUserById(userId);
  
      expect(result).toEqual({ user });
    });
  
    it('should throw NotFoundException for non-existing user', async () => {
      const userId = 999;
      jest.spyOn(userService, 'GetUserById').mockResolvedValue(null);
  
      try {
        await controller.getUserById(userId);
      } catch (error) {
        expect(error.response).toEqual('Usuário não encontrado.');
      }
    });
  });

  describe('getUsersByUsername', () => {
    it('should return multiple users by username', async () => {
      const username = 'testuser';
      const users = [];
      jest.spyOn(userService, 'GetUsersByUsername').mockResolvedValue(users);
  
      const result = await controller.getUsersByUsername(username);
  
      expect(result).toEqual({ users });
    });
  });

  describe('getUsersByUsername', () => {
    it('should return multiple users by username', async () => {
      const username = 'testuser';
      const users = [];
      jest.spyOn(userService, 'GetUsersByUsername').mockResolvedValue(users);
  
      const result = await controller.getUsersByUsername(username);
  
      expect(result).toEqual({ users });
    });
  });

  describe('getUsersWithMostLikes', () => {
    it('should return users with the most likes', async () => {
      const users = [];
      jest.spyOn(userService, 'GetUsersWithMostLikes').mockResolvedValue(users);

      const result = await controller.getUsersWithMostLikes();

      expect(result).toEqual({ users });
    });
  });

  describe('getUsersWithRecentActivity', () => {
    it('should return users with recent activity', async () => {
      const days = 7;
      const users = [];
      jest.spyOn(userService, 'GetUsersWithRecentActivity').mockResolvedValue(users);

      const result = await controller.getUsersWithRecentActivity( days );

      expect(result).toEqual({ users });
    });
  });

  describe('listFollowers', () => {
    it('should return followers by userId', async () => {
      const userId = 1;
      const followers = [];
      jest.spyOn(userService, 'ListFollowers').mockResolvedValue(followers);

      const result = await controller.listFollowers( userId );

      expect(result).toEqual({ followers });
    });
  });

  describe('listFollowing', () => {
    it('should return following by userId', async () => {
      const userId = 1;
      const following = [];
      jest.spyOn(userService, 'ListFollowing').mockResolvedValue(following);

      const result = await controller.listFollowing( userId );

      expect(result).toEqual({ following });
    });
  });

  // describe('createUser', () => {
  //   it('should create a new user', async () => {
  //     const createUserDto: CreateUserDto = {
  //       username: 'testuser',
  //       name: 'Test User',
  //       Bio: 'Bio information',
  //       email: 'test@example.com',
  //       password: 'hashedPassword',
  //       confirmPassword: 'hashedPassword',
  //       phone: '123456789',
  //       gender: 'male' as Gender,
  //       birthDate: new Date(),
  //       profilePhoto: 'path/to/photo',
  //       connectionId: 'connectionId',
  //     };
  //     const createdUser = {};
  //     jest.spyOn(userService, 'CreateUser').mockResolvedValue(createdUser);
  
  //     const result = await controller.createUser(createUserDto);
  
  //     expect(result).toEqual({ message: 'User created successfully!', user: createdUser });
  //   });
  // });

  // describe('deleteUser', () => {
  //   it('should delete a user by ID', async () => {
  //     const userId = 1;
  //     const deletedUser = {};
  //     jest.spyOn(userService, 'DeleteUser').mockResolvedValue(deletedUser);

  //     const result = await controller.deleteUser(userId);

  //     expect(result).toEqual({ message: 'Usuário removido com sucesso!', user: deletedUser });
  //   });
  // });

  // describe('patchUser', () => {
  //   it('should update a user by ID', async () => {
  //     const userId = 1;
  //     const patchUserDto: PatchUserDto = {
  //       username: 'testuser',
  //       name: 'Test User',
  //       Bio: 'Bio information',
  //       email: 'test@example.com',
  //       password: 'hashedPassword',
  //       confirmPassword: 'hashedPassword',
  //       phone: '123456789',
  //       gender: 'male' as Gender,
  //       birthDate: new Date(),
  //       profilePhoto: 'path/to/photo',
  //       connectionId: 'connectionId',
  //     };
  //     const existingUser = {};
  //     const updatedUser = {};

  //     jest.spyOn(userService, 'GetUserById').mockResolvedValue(existingUser);
  //     jest.spyOn(userService, 'PatchUser').mockResolvedValue(updatedUser);

  //     const result = await controller.patchUser(userId, patchUserDto);

  //     expect(result).toEqual({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
  //   });

  //   it('should throw NotFoundException for non-existing user', async () => {
  //     const userId = 999;
  //     const patchUserDto: PatchUserDto = {
  //       username: 'testuser',
  //       name: 'Test User',
  //       Bio: 'Bio information',
  //       email: 'test@example.com',
  //       password: 'hashedPassword',
  //       confirmPassword: 'hashedPassword',
  //       phone: '123456789',
  //       gender: 'male' as Gender,
  //       birthDate: new Date(),
  //       profilePhoto: 'path/to/photo',
  //       connectionId: 'connectionId',
  //     };

  //     jest.spyOn(userService, 'GetUserById').mockResolvedValue(null);

  //     try {
  //       await controller.patchUser(userId, patchUserDto);
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(NotFoundException);
  //       expect(error.message).toEqual('Usuário não encontrado.');
  //     }
  //   });
  // });
})