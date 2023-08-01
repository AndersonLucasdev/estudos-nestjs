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
import { CommentLikeService } from '../services/comment-like.service';
import { CreateCommentLikeDto } from '../dto/CreateCommentLike.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { formatUserData } from 'src/utils/FormartUserData';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

//   // Endpoint to get all users
//   @Get()
//   async getAllUsers() {
//     try {
//       const user = await this.commentLikeService.GetAllUsers();
//       return { user };
//     } catch (error) {
//       throw new NotFoundException('Não existem usuários.');
//     }
//   }

//   // Endpoint to get a user by ID
//   @Get(':id')
//   async getUserById(@Param('id', ParseIntPipe) id: number) {
//     const user = await this.commentLikeService.GetUserById(id);
//     if (!user) {
//       throw new NotFoundException('Usuário não encontrado.');
//     }
//     return { user };
//   }

//   // Method to get the user with that name

//   // Endpoint to create a new user
//   @Post()
//   @UsePipes(new DtoValidationPipe()) // Coloque a anotação aqui
//   async createUser(@Body() createUserDto: CreateUserDto) {
//     const user = await this.userService.CreateUser(createUserDto);
//     return { message: 'Usuário criado com sucesso!', user };
//   }

//   // Endpoint to delete a user by ID
//   @Delete(':id')
//   async deleteUser(@Param('id', ParseIntPipe) id: number) {
//     const user = await this.userService.DeleteUser(id);
//     return { message: 'Usuário removido com sucesso!', user };
//   }
}
