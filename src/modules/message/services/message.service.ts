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

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  // async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
  //   const { senderId, recipientId, content } = createMessageDto;

  //   // Create the message in the database
  //   const newMessage = await this.prisma.message.create({
  //     data: {
  //       sender: { connect: { id: senderId } },
  //       recipient: { connect: { id: recipientId } },
  //       content: TrimSpaces(content),
  //     },
  //   });

  //   return newMessage;
  // }

  // async deleteMessage(messageId: number): Promise<void> {
  //   const message = await this.prisma.message.findUnique({
  //     where: { id: messageId },
  //   });

  //   if (!message) {
  //     throw new NotFoundException(`Message with ID ${messageId} not found`);
  //   }

  //   // Delete the message
  //   await this.prisma.message.delete({
  //     where: { id: messageId },
  //   });
  // }

  // async updateMessage(messageId: number, content: string): Promise<Message> {
  //   const existingMessage = await this.prisma.message.findUnique({
  //     where: { id: messageId },
  //   });

  //   if (!existingMessage) {
  //     throw new NotFoundException(`Message with ID ${messageId} not found`);
  //   }

  //   // Update the message's content
  //   const updatedMessage = await this.prisma.message.update({
  //     where: { id: messageId },
  //     data: { content: TrimSpaces(content) },
  //   });

  //   return updatedMessage;
  // }

  // async getUserConversations(userId: number): Promise<Conversation[]> {
  //   const userConversations = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: {
  //       conversations: {
  //         include: {
  //           participants: true,
  //           messages: true,
  //         },
  //       },
  //     },
  //   });

  //   return userConversations.conversations;
  // }

  // async getAllMessagesInConversation(conversationId: number): Promise<Message[]> {
  //   const messages = await this.prisma.conversation.findUnique({
  //     where: { id: conversationId },
  //     include: {
  //       messages: {
  //         include: {
  //           sender: true,
  //           recipient: true,
  //         },
  //       },
  //     },
  //   });

  //   return messages.messages;
  // }

  // async getUserMessagesInConversation(userId: number, conversationId: number): Promise<Message[]> {
  //   const userMessages = await this.prisma.message.findMany({
  //     where: {
  //       senderId: userId,
  //       conversationId,
  //     },
  //     include: {
  //       sender: true,
  //       recipient: true,
  //     },
  //   });

  //   return userMessages;
  // }
}