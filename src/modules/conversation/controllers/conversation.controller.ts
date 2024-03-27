import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateConversationDto } from '../dto/CreateConversation.dto';
import { ConversationService } from '../services/conversation.service';
import { Conversation } from '@prisma/client';

@Controller('comment-like')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('user/:userId/conversations')
  async getUserConversations(@Param('userId', ParseIntPipe) userId: number): Promise<Conversation[]> {
    try {
      const userConversations = await this.conversationService.getUserConversations(userId);
      return userConversations;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId/recent-conversations')
  async getRecentConversations(@Param('userId', ParseIntPipe) userId: number): Promise<Conversation[]> {
    try {
      const recentConversations = await this.conversationService.getRecentConversations(userId);
      return recentConversations;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId/common-group-conversations')
  async searchConversationsByCommonGroups(@Param('userId', ParseIntPipe) userId: number): Promise<Conversation[]> {
    try {
      const commonGroupConversations = await this.conversationService.searchConversationsByCommonGroups(userId);
      return commonGroupConversations;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async searchConversationsByNamePart(@Query('namePart') namePart: string): Promise<Conversation[]> {
    try {
      const conversations = await this.conversationService.searchConversationsByNamePart(namePart);
      return conversations;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
