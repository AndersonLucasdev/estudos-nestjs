import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from '../dto/CreateConversation.dto';
import { TrimSpaces } from 'src/utils/helpers';
import { Conversation } from '@prisma/client';
import { User } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService, // Injete o WebSocketService
  ) {}

  async getUserConversations(userId: number): Promise<Conversation[]> {
    const userConversations = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        conversations: {
          include: {
            participants: true,
            messages: true,
          },
        },
      },
    });

    return userConversations.conversations;
  }

  // Implementação de Filtrar Conversas Mais Recentes
  async getRecentConversations(userId: number): Promise<Conversation[]> {
    const userConversations = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        conversations: {
          include: {
            participants: true,
            messages: {
              orderBy: { creationDate: 'desc' },
            },
          },
        },
      },
    });

    return userConversations.conversations;
  }

}

