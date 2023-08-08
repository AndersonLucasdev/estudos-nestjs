import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  //   // Method to get a comment by its ID
  //   async getCommentById(commentId: number): Promise<Message> {
  //     const comment = await this.prisma.message.findUnique({
  //       where: { id: commentId },
  //     });

  //     if (!comment) {
  //       throw new NotFoundException('Comment not found.');
  //     }

  //     return comment;
  //   }

  //   // Method to get all comments for a specific post
  //   async GetAllPostComments(postId: number): Promise<Message[]> {
  //     const comments = await this.prisma.message.findMany({
  //       where: { postId: postId },
  //     });

  //     if (!comments) {
  //       throw new NotFoundException('Comments not found.');
  //     }

  //     return comments;
  //   }

  //   async CreateComment(
  //     userId: number,
  //     postId: number,
  //     data: CreateMessageDto,
  //   ): Promise<Message> {
  //     const { content } = data;

  //     const contentTrimmed = TrimSpaces(content);
  //     const comment = await this.prisma.message.create({
  //       data: {
  //         ...data,
  //         content: contentTrimmed,
  //         userId: userId,
  //         postId: postId,
  //       },
  //     });

  //     return comment;
  //   }

  //   // Method to delete a comment by its ID
  //   async DeleteComment(id: number): Promise<Message> {
  //     const comment = await this.prisma.message.findUnique({ where: { id } });
  //     if (!comment) {
  //       throw new NotFoundException('Comentário não encontrado.');
  //     }

  //     await this.prisma.comment.delete({ where: { id } });
  //     return comment;
  //   }
}
