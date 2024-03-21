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
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Endpoint to get a comment by its ID
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment found', type: Comment })
  @ApiNotFoundResponse({ description: 'Comment not found' })
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
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments found', type: [Comment] })
  @ApiNotFoundResponse({ description: 'Comments not found' })
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
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments found', type: [Comment] })
  @ApiNotFoundResponse({ description: 'Comments not found' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Recent comments found', type: [Comment] })
  @ApiNotFoundResponse({ description: 'Comments not found' })
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
  @ApiResponse({ status: 201, description: 'Create a comment' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @UsePipes(new DtoValidationPipe())
  async createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.CreateComment(
      userId,
      postId,
      createCommentDto,
    );
    return { message: 'Comentário criado com sucesso!', comment };
  }

  // Endpoint to delete a comment by its ID
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentService.DeleteComment(id);
    return { message: 'Comentário removido com sucesso!', comment };
  }

  // Endpoint to update a comment by its ID
  @Patch(':id')
  @UsePipes(new DtoValidationPipe())
  async patchComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchCommentDto: PatchCommentDto,
  ) {
    try {
      if (patchCommentDto.content) {
        const trimmedcontent = patchCommentDto.content.trim();

        if (trimmedcontent.length === 0) {
          throw new NotFoundException('O comentário não pode ser vazio.');
        }
      }

      const updatedComment = await this.commentService.PatchComment(
        id,
        patchCommentDto,
      );

      return {
        message: 'Comentário atualizado com sucesso!',
        comment: updatedComment,
      };
    } catch (error) {
      return { error: 'Erro ao atualizar comentário. ' + error.message };
    }
  }
}
