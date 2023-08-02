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

@Controller('users')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Get(':commentId/likes')
  async getLikesInComment(@Param('commentId') commentId: number): Promise<number> {
    return this.commentLikeService.AccountLikesInComment(commentId);
  }

  @Post(':commentId/likes')
  async likeComment(@Param('commentId') commentId: number, @Body('userId') userId: number) {
    return this.commentLikeService.LikeComments(userId, commentId);
  }

  @Delete(':commentId/likes/:userId')
  async removeLikeFromComment(@Param('commentId') commentId: number, @Param('userId') userId: number) {
    return this.commentLikeService.RemoveLikeOnComment(userId, commentId);
  }
}
