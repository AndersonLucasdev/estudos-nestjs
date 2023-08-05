import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentLike } from '@prisma/client';
import { CreatePostLikeDto } from '../dto/CreatePostLike.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class PostLikeService {
  constructor(private readonly prisma: PrismaService) {}

  
}
