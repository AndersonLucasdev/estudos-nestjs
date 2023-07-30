import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PatchCommentDto } from '../dto/PatchComment.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) {}
  
    async GetCommentById(id: number): Promise<Post> {
      const comment = await this.prisma.post.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Usuário não encontrado.');
      }
      return comment;
    }
  
    async GetAllPosts(): Promise<Post[]> {
      const posts = await this.prisma.post.findMany();
      if (!posts || posts.length === 0) {
        throw new NotFoundException('Não existem posts publicados.');
      }
      return posts;
    }
  
    
  }
  