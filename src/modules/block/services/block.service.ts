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

  async createBlock(userId: number, blockedUserId: number): Promise<Block> {
    return this.prisma.block.create({
      data: {
        userId,
        blockedUserId,
      },
    });
  }

  async unlockUser(userId: number, blockedUserId: number): Promise<void> {
    const block = await this.prisma.block.findFirst({
      where: { userId: userId, blockedUserId: blockedUserId },
    });
    if (!block) {
      throw new NotFoundException('Block not found.');
    }
    await this.prisma.block.delete({
      where: { id: block.id },
    });
  }
  
}
