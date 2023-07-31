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

  // Method to get all posts
  async GetAllPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Method to get a specific post by ID
  async GetPostById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return post;
  }

  // Method to get posts by a specific user ID
  async GetPostsByUserId(userId: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({ where: { userId } });
    if (!posts) {
      throw new NotFoundException('Não existem posts para este usuário.');
    }
    return posts;
  }

  // Method to get all posts sorted by creation date (most recent first)
  async GetPostsSortedByCreatedAt(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { creationDate: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Method to get all posts sorted by popularity (most likes first)
  async GetPostsSortedByLikes(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { likes: 'desc' },
    });
    if (!posts) {
      throw new NotFoundException('Não existem posts publicados.');
    }
    return posts;
  }

  // Method to get the most popular posts based on the number of likes
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

  // Method to get the most popular posts in the last 5 days
  async GetPopularPostsLastFiveDays(limit: number): Promise<Post[]> {
    const currentDate = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(currentDate.getDate() - 5);

    const posts = await this.prisma.post.findMany({
      where: {
        creationDate: {
          gte: fiveDaysAgo, // Filters the posts with date greater than or equal to fiveDaysAgo
        },
      },
      orderBy: {
        likes: 'desc', // Sorts the posts by the number of likes in descending order
      },
      take: limit, // Limits the number of results returned
    });

    if (!posts) {
      throw new NotFoundException(
        'Não existem posts populares nos últimos 5 dias.',
      );
    }

    return posts;
  }

  // Method to create a new post
  async CreatePost(userId: number, data: CreatePostDto): Promise<Post> {
    const { description } = data;

    const descriptionTrimmed = TrimSpaces(description);
    const post = await this.prisma.post.create({
      data: {
        ...data,
        description: descriptionTrimmed,
        userId: userId,
      },
    });

    return post;
  }

  // Method to delete a post by its ID
  async DeletePost(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    await this.prisma.post.delete({ where: { id } });
    return post;
  }

  // Method to update a post by its ID
  async PatchPost(id: number, data: PatchPostDto): Promise<Post> {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException('Post não encontrado.');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: data,
    });

    return updatedPost;
  }
}
