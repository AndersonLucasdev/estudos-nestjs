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

  @Get()
  async getAllPosts() {
    try {
      const post = await this.postService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('Não existem posts.');
    }
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.GetPostById(id);
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return { post };
  }

  @Get('user/:userId')
  async getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const posts = await this.postService.GetPostsByUserId(userId);
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
  }

  @Get('sorted/created')
  async getPostsSortedByCreatedAt() {
    try {
      const posts = await this.postService.GetPostsSortedByCreatedAt();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }

  @Get('sorted/popular')
  async getPostsSortedByLikes() {
    try {
      const posts = await this.postService.GetPostsSortedByLikes();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }
  
  @Get('popular/last-five-days')
  async getPopularPostsLastFiveDays() {
    const limit = 10; // Defina aqui a quantidade de posts mais populares a serem retornados
    try {
      const popularPosts = await this.postService.GetPopularPostsLastFiveDays(limit);
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException('Não existem posts populares nos últimos 5 dias.');
    }
  }

}
