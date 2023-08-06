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

  @Get('likes')
  async getAllLikes() {
    return this.postLikeService.GetAllLikes();
  }

  @Get('likes/:likeId')
  async getLikeById(@Param('likeId') likeId: number) {
    return this.postLikeService.GetLikeById(likeId);
  }

  @Get('likes/details')
  async getAllLikesWithDetails() {
    return this.postLikeService.GetAllLikesWithDetails();
  }

  @Get('likes/post/:postId')
  async getLikesForPost(@Param('postId') postId: number) {
    return this.postLikeService.GetLikesForPost(postId);
  }

  @Get('likes/user/:userId')
  async getLikesForUser(@Param('userId') userId: number) {
    return this.postLikeService.GetLikesForUser(userId);
  }

  @Get('likes/count/:postId')
  async countLikesForPost(@Param('postId') postId: number) {
    return this.postLikeService.CountLikesForPost(postId);
  }

  @Get('likes/user/:userId')
  async GetLikesByUser(@Param('userId') userId: number) {
    const likes = await this.postLikeService.GetLikesByUser(userId);

    if (!likes) {
      throw new NotFoundException('Likes do usuário não encontrados.');
    }

    return likes;
  }

  @Get('likes/user/:userId/in-period')
  async getLikesForUserInPeriod(
    @Param('userId') userId: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.postLikeService.GetLikesForUserInPeriod(userId, startDate, endDate);
  }

  @Get('likes/users/liked-post/:postId')
  async getUsersWhoLikedPostWithPartialName(
    @Param('postId') postId: number,
    @Query('partialName') partialName: string,
  ) {
    return this.postLikeService.GetUsersWhoLikedPostWithPartialName(postId, partialName);
  }

  @Post('likes')
  async createLike(@Body() createLikeDto: CreatePostLikeDto)  {
    const { userId, postId } = createLikeDto;
    return this.postLikeService.CreateLike(userId, postId);
  }

  @Delete('likes/:userId/:postId')
  async removeLike(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postLikeService.RemoveLike(userId, postId);
  }
}
