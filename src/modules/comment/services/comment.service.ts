import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PatchCommentDto } from '../dto/PatchComment.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentById(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    return comment;
  }

  async GetAllPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId: postId },
    });

    if (!comments) {
      throw new NotFoundException('Comentários não encontrados.');
    }

    return comments;
  }

  async GetAllUserComments(userId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { userId: userId },
    });

    if (!comments) {
      throw new NotFoundException('Usúario não tem comentário(s) encontrado(s).');
    }

    return comments;
  }

  async GetRecentComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { creationDate: 'desc' },
      take: limit,
    });

    if (!comments) {
      throw new NotFoundException('Comentários não encontrados.');
    }

    return comments;
  }

  async GetPopularComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { likes: 'desc' },
      take: limit,
    });

    if (!comments) {
      throw new NotFoundException('Comentários não encontrados.');
    }

    return comments;
  }

  async CountPostComments(postId: number): Promise<number> {
    const count = await this.prisma.comment.count({
      where: { postId: postId },
    });

    return count;
  }

}
