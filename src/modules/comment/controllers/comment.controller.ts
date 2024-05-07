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
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Endpoint to get a comment by its ID
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment found',
    type: Comment,
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    try {
      const comment = await this.commentService.getCommentById(id);
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Comment not found.');
      }
      throw error;
    }
  }

  // Endpoint to get all comments for a specific post
  @Get('posts/:postId')
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments found',
    type: [Comment],
  })
  @ApiNotFoundResponse({ description: 'Comments not found' })
  async getAllPostComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllPostComments(id);
      return { comments }; // Use the name "comments" instead of "post" for consistency
    } catch (error) {
      throw new NotFoundException('Comment not found.');
    }
  }

  // Endpoint to get all comments made by a specific user
  @Get('users/:userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments found',
    type: [Comment],
  })
  @ApiNotFoundResponse({ description: 'Comments not found' })
  async getAllUserComments(@Param('id', ParseIntPipe) id: number) {
    try {
      const comments = await this.commentService.GetAllUserComments(id);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comment not found.');
    }
  }

  // Endpoint to get the most recent comments up to a specified limit
  @Get('recent')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recent comments found',
    type: [Comment],
  })
  @ApiNotFoundResponse({ description: 'Comments not found' })
  async getRecentComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetRecentComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comment not found.');
    }
  }

  // Endpoint to get the most popular comments based on the number of likes up to a specified limit
  @Get('popular')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular comments found',
    type: [Comment],
  })
  @ApiNotFoundResponse({ description: 'Comments not found' })
  async getPopularComments(@Query('limit', ParseIntPipe) limit: number) {
    try {
      const comments = await this.commentService.GetPopularComments(limit);
      return { comments };
    } catch (error) {
      throw new NotFoundException('Comment not found.');
    }
  }

  // Endpoint to count the number of comments for a specific post
  @Get('count/:postId')
  async countPostComments(@Param('postId', ParseIntPipe) postId: number) {
    try {
      const count = await this.commentService.CountPostComments(postId);
      return { count };
    } catch (error) {
      throw new NotFoundException('Comment not found.');
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
    try {
      const comment = await this.commentService.CreateComment(
        userId,
        postId,
        createCommentDto,
      );
      return { message: 'Create comment successfully!', comment };
    } catch (error) {
      throw new BadRequestException('Comment not found.');
    }
  }

  // Endpoint to delete a comment by its ID
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    try {
      const comment = await this.commentService.DeleteComment(id);
      if (!comment) {
        throw new NotFoundException('Comment not found.');
      }
      return { message: 'Like removed successfully!', comment };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Comment or user not found.');
    }
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
          throw new NotFoundException('Comment not found.');
        }
      }

      const updatedComment = await this.commentService.PatchComment(
        id,
        patchCommentDto,
      );

      return {
        message: 'Comment updated successfully!',
        comment: updatedComment,
      };
    } catch (error) {
      return { error: 'Error updating comment. ' + error.message };
    }
  }
}
