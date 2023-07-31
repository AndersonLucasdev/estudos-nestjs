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

  // Endpoint to get all posts
  @Get()
  async getAllPosts() {
    try {
      const post = await this.postService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('Não existem posts.');
    }
  }

  // Endpoint to get a specific post by ID
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.GetPostById(id);
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return { post };
  }

  // Endpoint to get posts from a specific user by user ID
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const posts = await this.postService.GetPostsByUserId(userId);
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
  }

  // Endpoint to get all posts sorted by creation date (newest first)
  @Get('sorted/created')
  async getPostsSortedByCreatedAt() {
    try {
      const posts = await this.postService.GetPostsSortedByCreatedAt();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }

  // Endpoint to get all posts sorted by popularity (most likes first)
  @Get('sorted/popular')
  async getPostsSortedByLikes() {
    try {
      const posts = await this.postService.GetPostsSortedByLikes();
      return { posts };
    } catch (error) {
      throw new NotFoundException('Não existem posts publicados.');
    }
  }

  // Endpoint to get the most popular posts based on the number of likes
  @Get('popular/:limit')
  async getPopularPosts(@Param('limit', ParseIntPipe) limit: number) {
    try {
      const popularPosts = await this.postService.GetPopularPosts(limit);
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException('Não existem posts populares.');
    }
  }

  // Endpoint to get the most popular posts in the last 5 days
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

  // Endpoint to create a post with userID
  @Post(':userId')
  @UsePipes(new DtoValidationPipe())
  async createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postService.CreatePost(userId, createPostDto);
    return { message: 'Post criado com sucesso!', post };
  }

  // Endpoint to delete a post by its ID
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.DeletePost(id);
    return { message: 'Post removido com sucesso!', post };
  }

  // Endpoint to update a post by its ID
  @Patch(':id')
  @UsePipes(new DtoValidationPipe())
  async patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchPostDto: PatchPostDto,
  ) {
    try {
      const existingUser = await this.postService.GetPostById(id);

      if (!existingUser) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      if (patchPostDto.description) {
        const trimmedDescription = patchPostDto.description.trim();
      }

      if (patchPostDto.disableComments) {
        const disableComments = patchPostDto.disableComments;
      }

      if (patchPostDto.image) {
        const image = patchPostDto.image;
      }

      const updatedPost = await this.postService.PatchPost(id, patchPostDto);

      return { message: 'Post atualizado com sucesso!', post: updatedPost };
    } catch (error) {
      return { error: 'Erro ao atualizar post. ' + error.message };
    }
  }
}
