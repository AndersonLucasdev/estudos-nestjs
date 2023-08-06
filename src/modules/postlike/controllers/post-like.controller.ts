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

@Controller('post-like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  // EndPoint: Get all likes
  @Get('likes')
  async getAllLikes() {
    return this.postLikeService.GetAllLikes();
  }

  // EndPoint: Get like by ID
  @Get('likes/:likeId')
  async getLikeById(@Param('likeId') likeId: number) {
    return this.postLikeService.GetLikeById(likeId);
  }

  // EndPoint: Get all likes with details (user and post information included)
  @Get('likes/details')
  async getAllLikesWithDetails() {
    return this.postLikeService.GetAllLikesWithDetails();
  }

  // EndPoint: Get all likes for a specific post
  @Get('likes/post/:postId')
  async getLikesForPost(@Param('postId') postId: number) {
    return this.postLikeService.GetLikesForPost(postId);
  }

  // EndPoint: Get all likes for a specific user
  @Get('likes/user/:userId')
  async getLikesForUser(@Param('userId') userId: number) {
    return this.postLikeService.GetLikesForUser(userId);
  }

  // EndPoint: Count total likes for a specific post
  @Get('likes/count/:postId')
  async countLikesForPost(@Param('postId') postId: number) {
    return this.postLikeService.CountLikesForPost(postId);
  }

  // EndPoint: Get all likes by user
  @Get('likes/user/:userId')
  async GetLikesByUser(@Param('userId') userId: number) {
    const likes = await this.postLikeService.GetLikesByUser(userId);

    if (!likes) {
      throw new NotFoundException('Likes of the user not found.');
    }

    return likes;
  }

  // EndPoint: Get likes by user within a specified period
  @Get('likes/user/:userId/in-period')
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
  async createLike(@Body() createLikeDto: CreatePostLikeDto) {
    const { userId, postId } = createLikeDto;
    return this.postLikeService.CreateLike(userId, postId);
  }

  // EndPoint: Remove a like made by a specific user for a specific post
  @Delete('likes/:userId/:postId')
  async removeLike(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postLikeService.RemoveLike(userId, postId);
  }
}
