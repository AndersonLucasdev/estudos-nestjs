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
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PatchCommentDto } from '../dto/PatchComment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  async getAllPostComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllPostComments(id);
      return { comments }; // Use o nome "comments" em vez de "post" para ser consistente
    } catch (error) {
      throw new NotFoundException('Não existem comentários para o post.');
    }
  }

  // @Get(':id')
  // async getPostById(@Param('id', ParseIntPipe) id: number) {
  //   const post = await this.commentService.GetPostById(id);
  //   if (!post) {
  //     throw new NotFoundException('Post não encontrado.');
  //   }
  //   return { post };
  // }
}
