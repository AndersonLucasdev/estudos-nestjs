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

@ApiTags('Post Likes')
@Controller('post-like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  // EndPoint: Get all likes
  @Get('likes')
  @ApiOperation({ summary: 'Get all likes' })
  @ApiResponse({ status: 200, description: 'Likes obtained successfully.' })
  async getAllLikes() {
    return this.postLikeService.GetAllLikes();
  }

  // EndPoint: Get like by ID
  @Get('likes/:likeId')
  @ApiOperation({ summary: 'Get like by ID' })
  @ApiParam({ name: 'likeId', description: 'ID of the like', type: Number })
  @ApiResponse({ status: 200, description: 'Like obtained successfully.' })
  async getLikeById(@Param('likeId') likeId: number) {
    return this.postLikeService.GetLikeById(likeId);
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
    return this.postLikeService.GetAllLikesWithDetails();
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
    return this.postLikeService.GetLikesForPost(postId);
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
    return this.postLikeService.GetLikesForUser(userId);
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
    return this.postLikeService.CountLikesForPost(postId);
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
    return this.postLikeService.GetLikesForUserInPeriod(
      userId,
      startDate,
      endDate,
    );
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
    return this.postLikeService.GetUsersWhoLikedPostWithPartialName(
      postId,
      partialName,
    );
  }

  // EndPoint: Create a new like for a specific post and user
  @Post('likes')
  @ApiOperation({ summary: 'Create a new like for a specific post and user' })
  @ApiBody({ type: CreatePostLikeDto })
  @ApiResponse({ status: 201, description: 'Like created successfully.' })
  async createLike(@Body() createLikeDto: CreatePostLikeDto) {
    const { userId, postId } = createLikeDto;
    return this.postLikeService.CreateLike(userId, postId);
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
    return this.postLikeService.RemoveLike(userId, postId);
  }
}
