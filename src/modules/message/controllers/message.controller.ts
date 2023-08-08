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
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('comments')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //   // Endpoint to get a comment by its ID
  //   @Get(':id')
  //   async getCommentById(@Param('id', ParseIntPipe) id: number) {
  //     try {
  //       const comment = await this.messageService.getCommentById(id);
  //       return comment;
  //     } catch (error) {
  //       if (error instanceof NotFoundException) {
  //         throw new NotFoundException('Comentário não encontrado.');
  //       }
  //       throw error;
  //     }
  //   }

  //   // Endpoint to get all comments for a specific post
  //   @Get('posts/:postId')
  //   async getAllPostComments(@Param('id', ParseIntPipe) id: number) {
  //     try {
  //       const comments = await this.messageService.GetAllPostComments(id);
  //       return { comments }; // Use the name "comments" instead of "post" for consistency
  //     } catch (error) {
  //       throw new NotFoundException('Não existem comentários para o post.');
  //     }
  //   }

  //   // Endpoint to create a comment with userID and postID
  //   @Post(':userId')
  //   @UsePipes(new DtoValidationPipe())
  //   async createPost(
  //     @Param('userId', ParseIntPipe) userId: number,
  //     @Param('postId', ParseIntPipe) postId: number,
  //     @Body() createMessageDto: CreateMessageDto,
  //   ) {
  //     const comment = await this.messageService.CreateComment(
  //       userId,
  //       postId,
  //       createMessageDto,
  //     );
  //     return { message: 'Comentário criado com sucesso!', comment };
  //   }

  //   // Endpoint to delete a comment by its ID
  //   @Delete(':id')
  //   async deleteComment(@Param('id', ParseIntPipe) id: number) {
  //     const comment = await this.messageService.DeleteComment(id);
  //     return { message: 'Comentário removido com sucesso!', comment };
  //   }
}
