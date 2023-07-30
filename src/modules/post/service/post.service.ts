import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from '../dto/CreatePost.dto';
import { PatchPostDto } from '../dto/PatchPost.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async GetAllPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  async GetPostById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return post;
  }

  async GetPostsByUserId(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({ where: { userId } });
    if (!posts) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
    return posts;
  }

  async GetPostsSortedByCreatedAt(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { creationDate: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  async GetPostsSortedByLikes(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { likes: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  async GetPopularPosts(limit: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { likes: 'desc' },
      take: limit,
    });
    if (!posts || posts.length === 0) {
      throw new NotFoundException('Não existem posts populares.');
    }
    return posts;
  }

  async GetPopularPostsLastFiveDays(limit: number): Promise<Post[]> {
    const currentDate = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(currentDate.getDate() - 5);

    const posts = await this.prisma.post.findMany({
      where: {
        creationDate: {
          gte: fiveDaysAgo, // Filtra os posts com data maior ou igual a fiveDaysAgo
        },
      },
      orderBy: {
        likes: 'desc', // Ordena os posts pelo número de curtidas em ordem decrescente
      },
      take: limit, // Limita o número de resultados retornados
    });

    if (!posts) {
      throw new NotFoundException(
        'Não existem posts populares nos últimos 5 dias.',
      );
    }

    return posts;
  }
}
