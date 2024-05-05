import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Block } from '@prisma/client';
import { CreateCommentDto } from 'src/modules/comment/dto/CreateComment.dto';
import { PatchCommentDto } from 'src/modules/comment/dto/PatchComment.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}


}
