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
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Endpoint to get a comment by its ID
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

  // Endpoint to get all comments for a specific post
  @Get('posts/:postId')
  async getAllPostComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllPostComments(id);
      return { comments }; // Use the name "comments" instead of "post" for consistency
    } catch (error) {
      throw new NotFoundException('Não existem comentários para o post.');
    }
  }

  // Endpoint to get all comments made by a specific user
  @Get('users/:userId')
  async getAllUserComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllUserComments(id);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Não existem comentários para o usuário.');
    }
  }

  // Endpoint to get the most recent comments up to a specified limit
  @Get('recent')
  async getRecentComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetRecentComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

  // Endpoint to get the most popular comments based on the number of likes up to a specified limit
  @Get('popular')
  async getPopularComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetPopularComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

  // Endpoint to count the number of comments for a specific post
  @Get('count/:postId')
  async countPostComments(@Param('postId', ParseIntPipe) postId: number) {
    try {
      const count = await this.commentService.CountPostComments(postId);
      return { count };
    } catch (error) {
      throw new NotFoundException('Comentários não encontrados.');
    }
  }

  // Endpoint to create a comment with userID and postID
  @Post(':userId')
  @UsePipes(new DtoValidationPipe())
  async createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.CreateComment(userId, postId, createCommentDto);
    return { message: 'Comentário criado com sucesso!', comment };
  }

  // Endpoint to delete a comment by its ID
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentService.DeleteComment(id);
    return { message: 'Comentário removido com sucesso!', comment };
  }
}
