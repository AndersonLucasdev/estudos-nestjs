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

  // Método para obter todos os posts
  async GetAllPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Método para obter um post específico pelo ID
  async GetPostById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return post;
  }

  // Método para obter posts de um usuário específico pelo ID do usuário
  async GetPostsByUserId(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({ where: { userId } });
    if (!posts) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
    return posts;
  }

  // Método para obter todos os posts ordenados por data de criação (mais recente primeiro)
  async GetPostsSortedByCreatedAt(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { creationDate: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Método para obter todos os posts ordenados por popularidade (mais curtidas primeiro)
  async GetPostsSortedByLikes(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { likes: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Método para obter os posts mais populares com base no número de curtidas
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

  // Método para obter os posts mais populares nos últimos 5 dias
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

  async CreatePost(userId: number, data: CreatePostDto): Promise<Post> {
    const { description } = data;

    const descriptiontrimed = TrimSpaces(description);
    const post = await this.prisma.post.create({
      data: {
        ...data,
        description: descriptiontrimed,
        userId: userId
      },
    });

    return post;
  }

  async DeletePost(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    await this.prisma.post.delete({ where: { id } });
    return post;
  }
}
