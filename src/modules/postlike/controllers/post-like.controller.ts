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
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostLikeService } from '../services/post-like.service';
import { CreatePostLikeDto } from '../dto/CreatePostLike.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Post Like')
@Controller('post-like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  // EndPoint: Get all likes
  @Get('likes')
  @ApiOperation({ summary: 'Get all likes' })
  @ApiResponse({ status: 200, description: 'Likes obtained successfully.' })
  async getAllLikes() {
    try {
      return await this.postLikeService.GetAllLikes();
    } catch (error) {
      throw new NotFoundException('Likes not found.');
    }
  }

  // EndPoint: Get like by ID
  @Get('likes/:likeId')
  @ApiOperation({ summary: 'Get like by ID' })
  @ApiParam({ name: 'likeId', description: 'ID of the like', type: Number })
  @ApiResponse({ status: 200, description: 'Like obtained successfully.' })
  async getLikeById(@Param('likeId') likeId: number) {
    try {
      const like = await this.postLikeService.GetLikeById(likeId);
      if (!like) {
        throw new NotFoundException('Like not found.');
      }
      return like;
    } catch (error) {
      throw new NotFoundException('Like not found.');
    }
  }

  // EndPoint: Get all likes with details (user and post information included)
  @Get('likes/details')
  @ApiOperation({
    summary: 'Get all likes with details (user and post information included)',
  })
  @ApiResponse({
    status: 200,
    description: 'Likes with details obtained successfully.',
  })
  async getAllLikesWithDetails() {
    try {
      return await this.postLikeService.GetAllLikesWithDetails();
    } catch (error) {
      throw new NotFoundException('Likes with details not found.');
    }
  }

  // EndPoint: Get all likes for a specific post
  @Get('likes/post/:postId')
  @ApiOperation({ summary: 'Get all likes for a specific post' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Likes for the post obtained successfully.',
  })
  async getLikesForPost(@Param('postId') postId: number) {
    try {
      return await this.postLikeService.GetLikesForPost(postId);
    } catch (error) {
      throw new NotFoundException('Likes for the post not found.');
    }
  }

  // EndPoint: Get all likes for a specific user
  @Get('likes/user/:userId')
  @ApiOperation({ summary: 'Get all likes for a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Likes for the user obtained successfully.',
  })
  async getLikesForUser(@Param('userId') userId: number) {
    try {
      const likes = await this.postLikeService.GetLikesForUser(userId);
      if (!likes) {
        throw new NotFoundException('Likes of the user not found.');
      }
      return likes;
    } catch (error) {
      throw new NotFoundException('Likes of the user not found.');
    }
  }

  // EndPoint: Count total likes for a specific post
  @Get('likes/count/:postId')
  @ApiOperation({ summary: 'Count total likes for a specific post' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Likes count for the post obtained successfully.',
  })
  async countLikesForPost(@Param('postId') postId: number) {
    try {
      const likes = await this.postLikeService.CountLikesForPost(postId);
      if (!likes) {
        throw new NotFoundException('Likes of the user not found.');
      }
      return likes;
    } catch (error) {
      throw new NotFoundException('Likes of the user not found.');
    }
  }

  // EndPoint: Get all likes by user
  @Get('likes/user/:userId')
  @ApiOperation({ summary: 'Get likes by user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Likes for the user obtained successfully.',
  })
  async GetLikesByUser(@Param('userId') userId: number) {
    const likes = await this.postLikeService.GetLikesByUser(userId);

    if (!likes) {
      throw new NotFoundException('Likes of the user not found.');
    }

    return likes;
  }

  // EndPoint: Get likes by user within a specified period
  @Get('likes/user/:userId/in-period')
  @ApiOperation({ summary: 'Get likes by user within a specified period' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for the period',
    type: Date,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for the period',
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: 'Likes for the user within the period obtained successfully.',
  })
  async getLikesForUserInPeriod(
    @Param('userId') userId: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    try {
      return await this.postLikeService.GetLikesForUserInPeriod(
        userId,
        startDate,
        endDate,
      );
    } catch (error) {
      throw new NotFoundException(
        'Likes for the user within the period not found.',
      );
    }
  }

  // EndPoint: Get users who liked a post and whose names contain the provided partial name
  @Get('likes/users/liked-post/:postId')
  @ApiOperation({
    summary:
      'Get users who liked a post and whose names contain the provided partial name',
  })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiQuery({
    name: 'partialName',
    description: 'Partial name to search for',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Users who liked the post obtained successfully.',
  })
  async getUsersWhoLikedPostWithPartialName(
    @Param('postId') postId: number,
    @Query('partialName') partialName: string,
  ) {
    try {
      return await this.postLikeService.GetUsersWhoLikedPostWithPartialName(
        postId,
        partialName,
      );
    } catch (error) {
      throw new NotFoundException('Users who liked the post not found.');
    }
  }

  // EndPoint: Create a new like for a specific post and user
  @Post('likes')
  @ApiOperation({ summary: 'Create a new like for a specific post and user' })
  @ApiBody({ type: CreatePostLikeDto })
  @ApiResponse({ status: 201, description: 'Like created successfully.' })
  async createLike(@Body() createLikeDto: CreatePostLikeDto) {
    try {
      const { userId, postId } = createLikeDto;
      return await this.postLikeService.CreateLike(userId, postId);
    } catch (error) {
      throw new BadRequestException('Failed to create like.');
    }
  }

  // EndPoint: Remove a like made by a specific user for a specific post
  @Delete('likes/:userId/:postId')
  @ApiOperation({
    summary: 'Remove a like made by a specific user for a specific post',
  })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Like removed successfully.' })
  async removeLike(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
  ) {
    try {
      return await this.postLikeService.RemoveLike(userId, postId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Like not found.');
      }
      throw error;
    }
  }
}
