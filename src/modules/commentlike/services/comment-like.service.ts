import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentLikeDto } from '../dto/CreateCommentLike.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class CommentLikeService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get a comment by its ID
  async getCommentById(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    return comment;
  }

  // Method to get all comments for a specific post
  async GetAllPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId: postId },
    });

    if (!comments) {
      throw new NotFoundException('Comments not found.');
    }

    return comments;
  }

  // Method to delete a comment by its ID
  async DeleteComment(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    await this.prisma.comment.delete({ where: { id } });
    return comment;
  }
}
