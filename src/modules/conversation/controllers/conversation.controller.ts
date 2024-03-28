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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Conversation')
@Controller('coversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('user/:userId/conversations')
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns user conversations', type: [CreateConversationDto] })
  async getUserConversations(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Conversation[]> {
    try {
      const userConversations =
        await this.conversationService.getUserConversations(userId);
      return userConversations;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get('user/:userId/recent-conversations')
  @ApiResponse({ status: 200, description: 'Returns recent conversations of the user', type: [CreateConversationDto] })
  async getRecentConversations(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Conversation[]> {
    try {
      const recentConversations =
        await this.conversationService.getRecentConversations(userId);
      return recentConversations;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get('user/:userId/common-group-conversations')
  @ApiResponse({ status: 200, description: 'Returns common group conversations of the user', type: [CreateConversationDto] })
  async searchConversationsByCommonGroups(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Conversation[]> {
    try {
      const commonGroupConversations =
        await this.conversationService.searchConversationsByCommonGroups(
          userId,
        );
      return commonGroupConversations;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiQuery({ name: 'namePart', description: 'Name part to search in conversations' })
  @Get('search')
  @ApiResponse({ status: 200, description: 'Returns conversations matching the search query', type: [CreateConversationDto] })
  async searchConversationsByNamePart(
    @Query('namePart') namePart: string,
  ): Promise<Conversation[]> {
    try {
      const conversations =
        await this.conversationService.searchConversationsByNamePart(namePart);
      return conversations;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @Patch(':id/add-participants')
  @ApiBody({ type: [Number], description: 'Array of participant IDs' })
  @ApiResponse({ status: 200, description: 'Participants added successfully' })
  async addParticipantsToConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body('participants', ParseIntPipe) participants: number[],
  ) {
    try {
      const updatedConversation =
        await this.conversationService.addParticipantsToConversation(
          id,
          participants,
        );
      return {
        message: 'Participants added successfully',
        conversation: updatedConversation,
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @Patch(':id/remove-participants')
  @ApiBody({ type: [Number], description: 'Array of participant IDs' })
  @ApiResponse({ status: 200, description: 'Participants removed successfully' })
  async removeParticipantsFromConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body('participants', ParseIntPipe) participants: number[],
  ) {
    try {
      const updatedConversation =
        await this.conversationService.removeParticipantsFromConversation(
          id,
          participants,
        );
      return {
        message: 'Participants removed successfully',
        conversation: updatedConversation,
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'userId', description: 'User ID' })
  @Post(':userId')
  @ApiBody({ type: CreateConversationDto, description: 'Details for creating a new conversation' })
  @ApiResponse({ status: 200, description: 'Conversation created successfully' })
  async createConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    try {
      const conversation = await this.conversationService.createConversation(
        userId,
        createConversationDto,
      );
      return {
        message: 'Conversation created successfully',
        conversation,
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Conversation deleted successfully' })
  async deleteConversation(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.conversationService.deleteConversation(id);
      return {
        message: 'Conversation deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
