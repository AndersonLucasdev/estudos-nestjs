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
import {
  ApiTags,
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comment Like')
@Controller('comment-like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  // EndPoint Returns the number of likes on a specific comment
  @Get(':commentId/likes')
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Number of likes on the comment' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async getLikesInComment(
    @Param('commentId') commentId: number,
  ): Promise<number> {
    try {
      const likesCount = await this.commentLikeService.AccountLikesInComment(commentId);
      return likesCount;
    } catch (error) {
      throw new NotFoundException('Comment not found');
    }
  }

  // EndPoint Adds a like to a specific comment based on the provided user ID
  @Post(':commentId/likes')
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Liked the comment successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async likeComment(
    @Param('commentId') commentId: number,
    @Body('userId') userId: number,
  ) {
    try {
      return await this.commentLikeService.LikeComments(userId, commentId);
    } catch (error) {
      throw new NotFoundException('Comment not found');
    }
  }

  // EndPoint Unlikes a specific comment based on the provided user and comment IDs
  @Delete(':commentId/likes/:userId')
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Like removed successfully' })
  @ApiNotFoundResponse({ description: 'Comment or user not found' })
  async removeLikeFromComment(
    @Param('commentId') commentId: number,
    @Param('userId') userId: number,
  ) {
    try {
      return await this.commentLikeService.RemoveLikeOnComment(userId, commentId);
    } catch (error) {
      throw new NotFoundException('Comment or user not found');
    }
  }
}
