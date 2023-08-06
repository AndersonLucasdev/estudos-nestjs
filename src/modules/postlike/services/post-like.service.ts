import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentLike, Post, PostLike } from '@prisma/client';
import { CreatePostLikeDto } from '../dto/CreatePostLike.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class PostLikeService {
  constructor(private readonly prisma: PrismaService) {}

  // Recupera todos os likes
  async getAllLikes(): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany();
    return likes;
  }

  // Recupera um like por ID
  async getLikeById(likeId: number): Promise<PostLike | null> {
    const like = await this.prisma.postLike.findUnique({
      where: { id: likeId },
    });

    if (!like) {
      throw new NotFoundException('Like não encontrado.');
    }

    return like;
  }

  // Recupera todos os likes de um post específico
  async getLikesForPost(postId: number): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany({
      where: { postId },
    });

    return likes;
  }

  // Recupera todos os likes de um usuário específico
  async getLikesForUser(userId: number): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany({
      where: { userId },
    });

    return likes;
  }

  // Conta o número total de likes em um post específico
  async countLikesForPost(postId: number): Promise<number> {
    const likesCount = await this.prisma.postLike.count({
      where: { postId },
    });

    return likesCount;
  }

  // Recupera todos os likes de um usuário
  async getLikesByUser(userId: number): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      where: { userId },
      include: { post: true },
    });
  }

  // Recupera todos os likes com informações detalhadas do usuário e post
  async getAllLikesWithDetails(): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      include: {
        user: true,
        post: true,
      },
    });
  }

  // Recupera todos os likes de um usuário em um determinado período
  async getLikesForUserInPeriod(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      where: {
        userId,
        post: {
          creationDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });
  }

  // Retorna todos os usuários que deram like em um post e cujo nome contém a parte fornecida
  async getUsersWhoLikedPostWithPartialName(
    postId: number,
    partialName: string,
  ): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      where: {
        postId,
        user: {
          name: {
            contains: partialName,
          },
        },
      },
    });
  }

  // Cria um novo like para um post e um usuário específico
  async createLike(userId: number, postId: number): Promise<PostLike> {
    const newLike = await this.prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });

    return newLike;
  }

  // Remove o like de um usuário em um post específico
  async removeLike(userId: number, postId: number): Promise<PostLike> {
    const deletedPostLike = await this.prisma.postLike.deleteMany({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (!deletedPostLike) {
      throw new NotFoundException('Like não encontrado.');
    }

    return deletedPostLike[0];
  }
}
