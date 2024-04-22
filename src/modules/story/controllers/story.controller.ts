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

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get(':id')
  async getStoryById(@Param('id') id: number): Promise<Story> {
    const story = await this.storyService.GetStoryById(id);
    if (!story) {
      throw new NotFoundException('Story não encontrado.');
    }
    return story;
  }

  async getStoriesByUserId(userId: number): Promise<Story[]> {
    const stories = await this.storyService.getStoriesByUserId(userId);
    if (!stories || stories.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return stories;
  }

  async getLast24HoursStoriesByUser(userId: number): Promise<Story[]> {
    const stories = await this.storyService.getLast24HoursStoriesByUser(userId);
    if (!stories || stories.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return stories;
  }
  
  async getUsersWhoViewedStory(storyId: number): Promise<User[]> {
    const users = await this.storyService.getUsersWhoViewedStory(storyId);
    if (!users || users.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return users;
  }

  async getStoryReplies(storyId: number): Promise<Message[]> {
    const replies = await this.storyService.getStoryReplies(storyId);
    if (!replies || replies.length === 0) {
      throw new NotFoundException('Story não encontrado.');
    }
    return replies;
  }

  @Post()
  async createStory(@Body() storyData: CreateStoryDto): Promise<Story> {
    return this.storyService.CreateStory(storyData);
  }

  @Patch(':id')
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
  async deleteStory(@Param('id') id: number): Promise<void> {
    await this.storyService.DeleteStory(id);
    const deletedStory = await this.storyService.GetStoryById(id);
    if (!deletedStory) {
      throw new NotFoundException(`Story com ID ${id} não encontrada`);
    }
  }
}
