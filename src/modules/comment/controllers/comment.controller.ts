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

  @Get()
  async getAllPosts() {
    try {
      const post = await this.commentService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('Não existem posts.');
    }
  }

//   @Get(':id')
//   async getPostById(@Param('id', ParseIntPipe) id: number) {
//     const post = await this.commentService.GetPostById(id);
//     if (!post) {
//       throw new NotFoundException('Post não encontrado.');
//     }
//     return { post };
//   }
}
