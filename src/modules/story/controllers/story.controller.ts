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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Story')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Story found successfully.' })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  async getStoryById(@Param('id') id: number): Promise<Story> {
    try {
      const story = await this.storyService.GetStoryById(id);
      if (!story) {
        throw new NotFoundException('Story not found.');
      }
      return story;
    } catch (error) {
      throw new NotFoundException('Story not found.');
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get stories by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Stories found successfully.' })
  @ApiResponse({ status: 404, description: 'Stories not found.' })
  async getStoriesByUserId(@Param('userId') userId: number): Promise<Story[]> {
    try {
      const stories = await this.storyService.getStoriesByUserId(userId);
      if (!stories || stories.length === 0) {
        throw new NotFoundException('Stories not found.');
      }
      return stories;
    } catch (error) {
      throw new NotFoundException('Stories not found.');
    }
  }

  @Get('user/:userId/last24hours')
  @ApiOperation({
    summary: 'Get stories by user ID posted in the last 24 hours',
  })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Stories found successfully.' })
  @ApiResponse({ status: 404, description: 'Stories not found.' })
  async getLast24HoursStoriesByUser(
    @Param('userId') userId: number,
  ): Promise<Story[]> {
    try {
      const stories = await this.storyService.getLast24HoursStoriesByUser(
        userId,
      );
      if (!stories || stories.length === 0) {
        throw new NotFoundException('Stories not found.');
      }
      return stories;
    } catch (error) {
      throw new NotFoundException('Stories not found.');
    }
  }

  @Get(':id/viewers')
  @ApiOperation({ summary: 'Get users who viewed a story' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Users found successfully.' })
  @ApiResponse({ status: 404, description: 'Users not found.' })
  async getUsersWhoViewedStory(@Param('id') storyId: number): Promise<User[]> {
    try {
      const users = await this.storyService.getUsersWhoViewedStory(storyId);
      if (!users || users.length === 0) {
        throw new NotFoundException('Users not found.');
      }
      return users;
    } catch (error) {
      throw new NotFoundException('Users not found.');
    }
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get replies to a story' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Replies found successfully.' })
  @ApiResponse({ status: 404, description: 'Replies not found.' })
  async getStoryReplies(@Param('id') storyId: number): Promise<Message[]> {
    try {
      const replies = await this.storyService.getStoryReplies(storyId);
      if (!replies || replies.length === 0) {
        throw new NotFoundException('Replies not found.');
      }
      return replies;
    } catch (error) {
      throw new NotFoundException('Replies not found.');
    }
  }

  @Patch(':id/increment-view-count')
  @ApiOperation({ summary: 'Increment view count of a story' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({
    status: 200,
    description: 'View count incremented successfully.',
  })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  async incrementViewCount(@Param('id') storyId: number): Promise<Story> {
    try {
      const viewscount = await this.storyService.incrementViewCount(storyId);
      if (!viewscount) {
        throw new NotFoundException('Error counting views.');
      }
      return viewscount;
    } catch (error) {
      throw new NotFoundException('Error counting views.');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new story' })
  @ApiBody({ type: CreateStoryDto })
  @ApiResponse({ status: 201, description: 'Story created successfully.' })
  async createStory(@Body() storyData: CreateStoryDto): Promise<Story> {
    try {
      return this.storyService.CreateStory(storyData);
    } catch (error) {
      throw new ConflictException('Error creating story.');
    }
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
    try {
      const updatedStory = await this.storyService.UpdateStory(id, storyData);
      if (!updatedStory) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
      return updatedStory;
    } catch (error) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a story by ID' })
  @ApiParam({ name: 'id', description: 'ID of the story', type: Number })
  @ApiResponse({ status: 200, description: 'Story deleted successfully.' })
  async deleteStory(@Param('id') id: number): Promise<void> {
    try {
      await this.storyService.DeleteStory(id);
      const deletedStory = await this.storyService.GetStoryById(id);
      if (!deletedStory) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
  }
}
