import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { PatchUserDto } from 'src/modules/user/dto/PatchUser.dto';

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

//   describe('getUserById', () => {
//     it('should return a user by ID', async () => {
//       const userId = 1;
//       const user = {};
//       jest.spyOn(userService, 'GetUserById').mockResolvedValue(user);

//       const result = await controller.getUserById(userId);

//       expect(result).toEqual({ user });
//     });

//     it('should throw NotFoundException for non-existing user', async () => {
//       const userId = 999;
//       jest.spyOn(userService, 'GetUserById').mockResolvedValue(null);

//       try {
//         await controller.getUserById(userId);
//       } catch (error) {
//         expect(error.response).toEqual('Usuário não encontrado.');
//       }
//     });
//   });

})