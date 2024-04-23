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
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Story } from '@prisma/client';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { User } from '@prisma/client';
import { Message } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Stories')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Story found successfully.' })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  async getStoryById(@Param('id') id: number): Promise<Story> {
    const story = await this.storyService.GetStoryById(id);
    if (!story) {
      throw new NotFoundException('Story não encontrado.');
    }
    return story;
  }

  @Get('user/:userId')
  async getStoriesByUserId(userId: number): Promise<Story[]> {
    const stories = await this.storyService.getStoriesByUserId(userId);
    if (!stories || stories.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return stories;
  }

  @Get('user/:userId/last24hours')
  async getLast24HoursStoriesByUser(userId: number): Promise<Story[]> {
    const stories = await this.storyService.getLast24HoursStoriesByUser(userId);
    if (!stories || stories.length === 0) {
      throw new NotFoundException('Stories não encontrados.');
    }
    return stories;
  }
  
  @Get(':id/viewers')
  async getUsersWhoViewedStory(storyId: number): Promise<User[]> {
    const users = await this.storyService.getUsersWhoViewedStory(storyId);
    if (!users || users.length === 0) {
      throw new NotFoundException('Usuários não encontrados.');
    }
    return users;
  }

  @Get(':id/replies')
  async getStoryReplies(storyId: number): Promise<Message[]> {
    const replies = await this.storyService.getStoryReplies(storyId);
    if (!replies || replies.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return replies;
  }

  @Get(':id/increment-view-count')
  async incrementViewCount(@Param('id') storyId: number): Promise<Story> {
    const viewscount = await this.storyService.incrementViewCount(storyId);
    if (!viewscount) {
      throw new NotFoundException(`Erro ao contar usuários.`);
    }
    return viewscount;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new story' })
  @ApiBody({ type: CreateStoryDto })
  @ApiResponse({ status: 201, description: 'Story created successfully.' })
  async createStory(@Body() storyData: CreateStoryDto): Promise<Story> {
    return this.storyService.CreateStory(storyData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a story by ID' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiBody({ type: PatchStoryDto })
  @ApiResponse({ status: 200, description: 'Story updated successfully.' })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  async updateStory(
    @Param('id') id: number,
    @Body() storyData: PatchStoryDto,
  ): Promise<Story> {
    const updatedStory = await this.storyService.UpdateStory(id, storyData);
    if (!updatedStory) {
      throw new NotFoundException(`Story com ID ${id} não encontrada`);
    }
    return updatedStory;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a story by ID' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Story deleted successfully.' })
  async deleteStory(@Param('id') id: number): Promise<void> {
    await this.storyService.DeleteStory(id);
    const deletedStory = await this.storyService.GetStoryById(id);
    if (!deletedStory) {
      throw new NotFoundException(`Story com ID ${id} não encontrada`);
    }
  }
}
