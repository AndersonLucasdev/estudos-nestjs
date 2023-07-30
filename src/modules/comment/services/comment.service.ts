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

  async GetAllPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId: postId },
    });

    if (comments.length === 0) {
      throw new NotFoundException('Comentários não encontrados.');
    }

    return comments;
  }

  async GetAllUserComments(userId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { userId: userId },
    });

    if (comments.length === 0) {
      throw new NotFoundException('Usúario não tem comentário(s) encontrado(s).');
    }

    return comments;
  }

  async GetRecentComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { creationDate: 'desc' },
      take: limit,
    });

    if (comments.length === 0) {
      throw new NotFoundException('Comentários não encontrados.');
    }

    return comments;
  }

  async GetPopularComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { likes: 'desc' },
      take: limit,
    });

    if (comments.length === 0) {
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

  // async GetAllPosts(): Promise<Comment[]> {
  //   const posts = await this.prisma.comment.findMany();
  //   if (!posts || posts.length === 0) {
  //     throw new NotFoundException('Não existem posts publicados.');
  //   }
  //   return posts;
  // }
}
