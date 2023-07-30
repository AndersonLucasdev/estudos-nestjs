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
  
    async GetPostById(id: number): Promise<Post> {
      const post = await this.prisma.post.findUnique({ where: { id } });
      if (!post) {
        throw new NotFoundException('Post não encontrado.');
      }
      return post;
    }
  
    async GetAllPosts(): Promise<Post[]> {
      const posts = await this.prisma.post.findMany();
      if (!posts || posts.length === 0) {
        throw new NotFoundException('Não existem posts publicados.');
      }
      return posts;
    }
  
    
  }
  