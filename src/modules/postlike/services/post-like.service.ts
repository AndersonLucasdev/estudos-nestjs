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
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  // Recupera todos os likes
  async GetAllLikes(): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany();
    return likes;
  }

  // Recupera um like por ID
  async GetLikeById(likeId: number): Promise<PostLike | null> {
    const like = await this.prisma.postLike.findUnique({
      where: { id: likeId },
    });

    if (!like) {
      throw new NotFoundException('Like não encontrado.');
    }

    return like;
  }

  // Recupera todos os likes de um post específico
  async GetLikesForPost(postId: number): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany({
      where: { postId },
    });

    return likes;
  }

  // Recupera todos os likes de um usuário específico
  async GetLikesForUser(userId: number): Promise<PostLike[]> {
    const likes = await this.prisma.postLike.findMany({
      where: { userId },
    });

    return likes;
  }

  // Conta o número total de likes em um post específico
  async CountLikesForPost(postId: number): Promise<number> {
    const likesCount = await this.prisma.postLike.count({
      where: { postId },
    });

    return likesCount;
  }

  // Recupera todos os likes de um usuário
  async GetLikesByUser(userId: number): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      where: { userId },
      include: { post: true },
    });
  }

  // Recupera todos os likes com informações detalhadas do usuário e post
  async GetAllLikesWithDetails(): Promise<PostLike[]> {
    return this.prisma.postLike.findMany({
      include: {
        user: true,
        post: true,
      },
    });
  }

  // Recupera todos os likes de um usuário em um determinado período
  async GetLikesForUserInPeriod(
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
  async GetUsersWhoLikedPostWithPartialName(
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
  public async CreateLike(userId: number, postId: number): Promise<PostLike> {
    const newLike = await this.prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });

    await this.notifyPostLikeChange(postId, userId);

    return newLike;
  }

  // Remove o like de um usuário em um post específico
  async RemoveLike(userId: number, postId: number): Promise<void> {
    const result = await this.prisma.postLike.deleteMany({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Like não encontrado.');
    }
  }

  private async notifyPostLikeChange(postId: number, likerId: number): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    this.webSocketService.sendNotificationToUser(post.userId, { message: `Alguém curtiu seu post.` });
  }
}
