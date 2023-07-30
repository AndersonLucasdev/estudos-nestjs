import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PatchCommentDto } from '../dto/PatchComment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    try {
      const comment = await this.commentService.getCommentById(id);
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Comentário não encontrado.');
      }
      throw error;
    }
  }

  @Get('posts/:postId')
  async getAllPostComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllPostComments(id);
      return { comments }; // Use o nome "comments" em vez de "post" para ser consistente
    } catch (error) {
      throw new NotFoundException('Não existem comentários para o post.');
    }
  }

  @Get('users/:userId')
  async getAllUserComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllUserComments(id);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Não existem comentários para o usuário.');
    }
  }

  @Get('recent')
  async getRecentComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetRecentComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

  @Get('popular')
  async getPopularComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetPopularComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

  @Get('count/:postId')
  async countPostComments(@Param('postId', ParseIntPipe) postId: number) {
    try {
      const count = await this.commentService.CountPostComments(postId);
      return { count };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

}
