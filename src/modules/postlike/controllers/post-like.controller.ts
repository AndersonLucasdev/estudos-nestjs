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
  import { PostLikeService } from '../services/post-like.service';
  import { CreatePostLikeDto } from '../dto/CreatePostLike.dto';
  import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
  import { formatUserData } from 'src/utils/FormartUserData';
  import * as bcrypt from 'bcrypt';
  
  @Controller('users')
  export class PostLikeController {
    constructor(private readonly postLikeService: PostLikeService) {}
  
    // // EndPoint Returns the number of likes on a specific comment
    // @Get(':commentId/likes')
    // async getLikesInComment(@Param('commentId') commentId: number): Promise<number> {
    //   return this.postLikeService.AccountLikesInComment(commentId);
    // }
  
    // // EndPoint Adds a like to a specific comment based on the provided user ID
    // @Post(':commentId/likes')
    // async likeComment(@Param('commentId') commentId: number, @Body('userId') userId: number) {
    //   return this.postLikeService.LikeComments(userId, commentId);
    // }
  
    // // EndPoint Unlikes a specific comment based on the provided user and comment IDs
    // @Delete(':commentId/likes/:userId')
    // async removeLikeFromComment(@Param('commentId') commentId: number, @Param('userId') userId: number) {
    //   return this.postLikeService.RemoveLikeOnComment(userId, commentId);
    // }
  }
  