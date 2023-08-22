import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { Message } from '@prisma/client';
import { Conversation } from '@prisma/client';
import { PatchMessageDto } from '../dto/PatchMessage.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.sendMessage(createMessageDto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') messageId: number): Promise<void> {
    return this.messageService.deleteMessage(messageId);
  }

  @Patch(':id')
  async updateMessage(
    @Param('id') messageId: number,
    @Body() updateMessageDto: PatchMessageDto,
  ): Promise<Message> {
    return this.messageService.updateMessage(
      messageId,
      updateMessageDto.content,
    );
  }

  @Get('conversations/:conversationId/messages')
  async getAllMessagesInConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<Message[]> {
    return this.messageService.getAllMessagesInConversation(conversationId);
  }

  @Get(':userId/conversations/:conversationId/messages')
  async getUserMessagesInConversation(
    @Param('userId') userId: number,
    @Param('conversationId') conversationId: number,
  ): Promise<Message[]> {
    return this.messageService.getUserMessagesInConversation(
      userId,
      conversationId,
    );
  }

  @Post('reply/:messageId')
  async replyToMessage(
    @Param('messageId') messageId: number,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.replyToMessage(
      messageId,
      createMessageDto.content,
    );
  }
}
