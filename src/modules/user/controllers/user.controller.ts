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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint to get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users obtained successfully.' })
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
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'User found successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.GetUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return { user };
  }

  // EndPoint to get the user with that name
  @Get('by-username')
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiQuery({ name: 'username', description: 'Username', type: String })
  @ApiResponse({ status: 200, description: 'User found successfully.' })
  async getUserByUsername(@Query('username') username: string) {
    const user = await this.userService.GetUserByUsername(username);
    return user;
  }

  // EndPoint to find multiple people with that part of the name
  @Get('by-username/multiple')
  @ApiOperation({ summary: 'Get users by part of the username' })
  @ApiQuery({ name: 'username', description: 'Partial username', type: String })
  @ApiResponse({ status: 200, description: 'Users found successfully.' })
  async getUsersByUsername(@Query('username') username: string) {
    const users = await this.userService.GetUsersByUsername(username);
    return users;
  }

  // EndPoint to get users with more likes
  @Get('most-likes')
  @ApiOperation({ summary: 'Get users with the most likes' })
  @ApiResponse({ status: 200, description: 'Users with the most likes obtained successfully.' })
  async getUsersWithMostLikes() {
    const users = await this.userService.GetUsersWithMostLikes();
    return users;
  }

  // EndPoint to get users with latest updates
  @Get('recent-activity')
  @ApiOperation({ summary: 'Get users with recent activity' })
  @ApiQuery({ name: 'days', description: 'Number of days for recent activity', type: Number })
  @ApiResponse({ status: 200, description: 'Users with recent activity obtained successfully.' })
  async getUsersWithRecentActivity(@Query('days') days: number) {
    const users = await this.userService.GetUsersWithRecentActivity(days);
    return users;
  }

  // EndPoint get followers by userid
  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get followers by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Followers obtained successfully.' })
  async listFollowers(@Param('userId') userId: number) {
    const followers = await this.userService.ListFollowers(userId);
    return followers;
  }

  // EndPoint get follings by userid
  @Get(':userId/following')
  @ApiOperation({ summary: 'Get followings by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Followings obtained successfully.' })
  async listFollowing(@Param('userId') userId: number) {
    const following = await this.userService.ListFollowing(userId);
    return following;
  }

  // Endpoint to create a new user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @UsePipes(new DtoValidationPipe()) // Coloque a anotação aqui
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.CreateUser(createUserDto);
    return { message: 'Usuário criado com sucesso!', user };
  }

  // Endpoint to delete a user by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'User removed successfully.' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.DeleteUser(id);
    return { message: 'Usuário removido com sucesso!', user };
  }

  // Endpoint to update a user by ID
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: Number })
  @ApiBody({ type: PatchUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Conflict while updating user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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
