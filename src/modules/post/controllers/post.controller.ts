import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/CreatePost.dto';
import { PatchPostDto } from '../dto/PatchPost.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Método para obter todos os posts
  @Get()
  async getAllPosts() {
    try {
      const post = await this.postService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('Não existem posts.');
    }
  }

  // Método para obter um post específico pelo ID
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.GetPostById(id);
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return { post };
  }

  // Método para obter posts de um usuário específico pelo ID do usuário
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const posts = await this.postService.GetPostsByUserId(userId);
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
  }

  // Método para obter todos os posts ordenados por data de criação (mais recente primeiro)
  @Get('sorted/created')
  async getPostsSortedByCreatedAt() {
    try {
      const posts = await this.postService.GetPostsSortedByCreatedAt();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }

  // Método para obter todos os posts ordenados por popularidade (mais curtidas primeiro)
  @Get('sorted/popular')
  async getPostsSortedByLikes() {
    try {
      const posts = await this.postService.GetPostsSortedByLikes();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }

  // Método para obter os posts mais populares com base no número de curtidas
  @Get('popular/:limit')
  async getPopularPosts(@Param('limit', ParseIntPipe) limit: number) {
    try {
      const popularPosts = await this.postService.GetPopularPosts(limit);
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException('Não existem posts populares.');
    }
  }

  // Método para obter os posts mais populares nos últimos 5 dias
  @Get('popular/last-five-days')
  async getPopularPostsLastFiveDays() {
    const limit = 5;
    try {
      const popularPosts = await this.postService.GetPopularPostsLastFiveDays(
        limit,
      );
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException(
        'Não existem posts populares nos últimos 5 dias.',
      );
    }
  }
}
