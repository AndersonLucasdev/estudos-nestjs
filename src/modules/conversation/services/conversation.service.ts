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

  async searchConversationsByCommonGroups(userId: number): Promise<Conversation[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        conversations: {
          include: {
            participants: true,
          },
        },
      },
    });
  
    const userGroups = user.conversations.flatMap(conv => conv.participants.map(participant => participant.id));
  
    const commonGroupConversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: {
              in: userGroups,
            },
          },
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  
    return commonGroupConversations;
  }

  async searchConversationsByNamePart(namePart: string): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        name: {
          contains: namePart,
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  
    return conversations;
  }

  async updateConversationName(conversationId: number, newName: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { name: newName },
      include: {
        participants: true,
        messages: true,
      },
    });
  
    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }
  
    return conversation;
  }
  
  async addParticipantsToConversation(conversationId: number, participants: number[]): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });
  
    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }
  
    const existingParticipantIds = conversation.participants.map(participant => participant.id);
    const newParticipantIds = participants.filter(id => !existingParticipantIds.includes(id));
  
    const updatedConversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        participants: {
          connect: newParticipantIds.map(id => ({ id })),
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  
    return updatedConversation;
  }

  

  async createConversation(userId: number, createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { participants, groupName } = createConversationDto;
  
    const users = await this.prisma.user.findMany({
      where: { id: { in: participants } },
    });
  
    if (users.length !== participants.length) {
      throw new NotFoundException('Algum participante não encontrado.');
    }
  
    let conversationName = 'Group Conversation';
  
    if (participants.length === 2) {
      const otherUser = users.find(user => user.id !== userId);
      conversationName = otherUser?.name || conversationName;
    } else if (participants.length > 2 && groupName) {
      conversationName = groupName;
    }
  
    const conversation = await this.prisma.conversation.create({
      data: {
        name: conversationName,
        participants: { connect: participants.map(id => ({ id })) },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  
    return conversation;
  }

  async deleteConversation(conversationId: number): Promise<void> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encotrada.');
    }

    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });
  }
}

