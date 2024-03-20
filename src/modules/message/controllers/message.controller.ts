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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message sent successfully.', type: CreateMessageDto })
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.sendMessage(createMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the message', type: Number })
  @ApiResponse({ status: 200, description: 'Message deleted successfully.' })
  async deleteMessage(@Param('id') messageId: number): Promise<void> {
    return this.messageService.deleteMessage(messageId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a message by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the message', type: Number })
  @ApiBody({ type: PatchMessageDto })
  @ApiResponse({ status: 200, description: 'Message updated successfully.', type: CreateMessageDto })
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
  @ApiOperation({ summary: 'Get messages of a user in a conversation' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({ name: 'conversationId', description: 'ID of the conversation', type: Number })
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
  @ApiOperation({ summary: 'Reply to a message' })
  @ApiParam({ name: 'messageId', description: 'ID of the message', type: Number })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message replied successfully.', type: CreateMessageDto })
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
