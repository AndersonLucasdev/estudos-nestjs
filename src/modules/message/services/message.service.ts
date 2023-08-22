import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { TrimSpaces } from 'src/utils/helpers';
import { Conversation } from '@prisma/client';
import { User } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService, // Injete o WebSocketService
  ) {}
  
  // Method
  async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { senderId, recipientId, content } = createMessageDto;
  
    const newMessage = await this.prisma.message.create({
      data: {
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } }, // Adicione o destinatário aqui
        content: content, // Adicione o conteúdo aqui
      },
    });
  
    const recipient: User = await this.prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (recipient) {
      // Adicione a conexão WebSocket do destinatário ao WebSocketService
      this.webSocketService.addUserConnection(recipient.id, recipient.connectionId); // Suponha que você tenha o campo connectionId no modelo User
  
      const notification = {
        type: 'new_message',
        message: 'Você recebeu uma nova mensagem!',
      };
  
      // Enviar a notificação em tempo real para o destinatário
      this.webSocketService.sendNotificationToUser(recipient.id, notification);
    }
  
    return newMessage;
  }

  async deleteMessage(messageId: number): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Delete the message
    await this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  async updateMessage(messageId: number, content: string): Promise<Message> {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Update the message's content
    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { content: TrimSpaces(content) },
    });

    return updatedMessage;
  }


  async getAllMessagesInConversation(conversationId: number): Promise<Message[]> {
    const messages = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: {
            sender: true,
            recipient: true,
          },
        },
      },
    });

    return messages.messages;
  }

  async getUserMessagesInConversation(userId: number, conversationId: number): Promise<Message[]> {
    const userMessages = await this.prisma.message.findMany({
      where: {
        senderId: userId,
        conversationId,
      },
      include: {
        sender: true,
        recipient: true,
      },
    });

    return userMessages;
  }

  // Implementação de Respostas Diretas
  async replyToMessage(messageId: number, content: string): Promise<Message> {
    const parentMessage: Message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!parentMessage) {
      throw new NotFoundException(`Parent message with ID ${messageId} not found`);
    }

    const replyMessage: Message = await this.prisma.message.create({
      data: {
        sender: { connect: { id: parentMessage.recipientId } },
        recipient: { connect: { id: parentMessage.senderId } },
        content: TrimSpaces(content),
        conversation: { connect: { id: parentMessage.conversationId } },
      },
    });

    return replyMessage;
  }

  
}