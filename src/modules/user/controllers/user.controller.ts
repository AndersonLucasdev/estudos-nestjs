import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { formatUserData } from 'src/utils/FormartUserData';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint to get all users
  @Get()
  async getAllUsers() {
    try {
      const user = await this.userService.GetAllUsers();
      return { user };
    } catch (error) {
      throw new NotFoundException('Não existem usuários.');
    }
  }

  // Endpoint to get a user by ID
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.GetUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return { user };
  }

  // Method to get the user with that name
  @Get('by-username')
  async getUserByUsername(@Query('username') username: string) {
    const user = await this.userService.GetUserByUsername(username);
    return user;
  }

  // Method to find multiple people with that part of the name
  @Get('by-username/multiple')
  async getUsersByUsername(@Query('username') username: string) {
    const users = await this.userService.GetUsersByUsername(username);
    return users;
  }

  // Method to get users with more likes
  @Get('most-likes')
  async getUsersWithMostLikes() {
    const users = await this.userService.GetUsersWithMostLikes();
    return users;
  }

  //method to get users with latest updates
  @Get('recent-activity')
  async getUsersWithRecentActivity(@Query('days') days: number) {
    const users = await this.userService.GetUsersWithRecentActivity(days);
    return users;
  }

  // Endpoint to create a new user
  @Post()
  @UsePipes(new DtoValidationPipe()) // Coloque a anotação aqui
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.CreateUser(createUserDto);
    return { message: 'Usuário criado com sucesso!', user };
  }

  // Endpoint to delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.DeleteUser(id);
    return { message: 'Usuário removido com sucesso!', user };
  }

  // Endpoint to update a user by ID
  @Patch(':id')
  @UsePipes(new DtoValidationPipe())
  async patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    try {
      const existingUser = await this.userService.GetUserById(id);

      if (!existingUser) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (patchUserDto.email) {
        const trimmedEmail = patchUserDto.email.trim();
        const existingUserEmail = await this.userService.GetUserByEmail(
          trimmedEmail,
        );

        if (existingUserEmail && existingUserEmail.id !== id) {
          throw new ConflictException('O e-mail já está em uso.');
        }
      }

      if (patchUserDto.username) {
        const trimmedUsername = patchUserDto.username.trim();
        const existingUserName = await this.userService.GetUserByUsername(
          trimmedUsername,
        );

        if (existingUserName && existingUserName.id !== id) {
          throw new ConflictException('O username já está em uso.');
        }
      }

      if (patchUserDto.password) {
        const trimmedPassword = patchUserDto.password.trim();
        const trimmedConfirmPassword = patchUserDto.confirmPassword.trim();

        if (trimmedPassword !== trimmedConfirmPassword) {
          throw new BadRequestException('As senhas não coincidem.');
        }

        patchUserDto.password = await bcrypt.hash(trimmedPassword, 10);
      }

      const updatedUser = await this.userService.PatchUser(id, patchUserDto);

      return { message: 'Usuário atualizado com sucesso!', user: updatedUser };
    } catch (error) {
      return { error: 'Erro ao atualizar usuário. ' + error.message };
    }
  }
}
