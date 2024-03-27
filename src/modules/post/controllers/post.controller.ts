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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Endpoint to get all posts
  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts obtained successfully.' })
  async getAllPosts() {
    try {
      const post = await this.postService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('No posts found.');
    }
  }

  // Endpoint to get a specific post by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Post obtained successfully.' })
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.GetPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return { post };
  }

  // Endpoint to get posts from a specific user by user ID
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts from a specific user by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Posts obtained successfully.' })
  async getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const posts = await this.postService.GetPostsByUserId(userId);
      return { posts };
    } catch (error) {
      throw new NotFoundException('No posts found for this user.');
    }
  }

  // Endpoint to get all posts sorted by creation date (newest first)
  @Get('sorted/created')
  @ApiOperation({
    summary: 'Get all posts sorted by creation date (newest first)',
  })
  @ApiResponse({ status: 200, description: 'Posts obtained successfully.' })
  async getPostsSortedByCreatedAt() {
    try {
      const posts = await this.postService.GetPostsSortedByCreatedAt();
      return { posts };
    } catch (error) {
      throw new NotFoundException('No published posts.');
    }
  }

  // Endpoint to get all posts sorted by popularity (most likes first)
  @Get('sorted/popular')
  @ApiOperation({
    summary: 'Get all posts sorted by popularity (most likes first)',
  })
  @ApiResponse({ status: 200, description: 'Posts obtained successfully.' })
  async getPostsSortedByLikes() {
    try {
      const posts = await this.postService.GetPostsSortedByLikes();
      return { posts };
    } catch (error) {
      throw new NotFoundException('No published posts.');
    }
  }

  // Endpoint to get the most popular posts based on the number of likes
  @Get('popular/:limit')
  @ApiOperation({
    summary: 'Get the most popular posts based on the number of likes',
  })
  @ApiParam({
    name: 'limit',
    description: 'Maximum number of popular posts to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Popular posts obtained successfully.',
  })
  async getPopularPosts(@Param('limit', ParseIntPipe) limit: number) {
    try {
      const popularPosts = await this.postService.GetPopularPosts(limit);
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException('No popular posts found.');
    }
  }

  // Endpoint to get the most popular posts in the last 5 days
  @Get('popular/last-five-days')
  @ApiOperation({ summary: 'Get the most popular posts in the last 5 days' })
  @ApiResponse({
    status: 200,
    description: 'Popular posts obtained successfully.',
  })
  async getPopularPostsLastFiveDays() {
    const limit = 5;
    try {
      const popularPosts = await this.postService.GetPopularPostsLastFiveDays(
        limit,
      );
      return { popularPosts };
    } catch (error) {
      throw new NotFoundException('No popular posts in the last 5 days.');
    }
  }

  // Endpoint to create a post with userID
  @Post(':userId')
  @ApiOperation({ summary: 'Create a post with userID' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user creating the post',
    type: Number,
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
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
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Post removed successfully.' })
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.DeletePost(id);
    return { message: 'Post removido com sucesso!', post };
  }

  // Endpoint to update a post by its ID
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', description: 'Post of the user', type: Number })
  @ApiBody({ type: PatchPostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 409, description: 'Conflict while updating post.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new DtoValidationPipe())
  async patchPost(
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
