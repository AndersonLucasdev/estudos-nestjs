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
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { PatchUserDto } from 'src/modules/user/dto/PatchUser.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get(':id')
  async getStoryById(@Param('id') id: number): Promise<Story> {
    const story = await this.storyService.getStoryById(id);
    if (!story) {
      throw new NotFoundException('História não encontrada.');
    }
    return story;
  }

  @Post()
  async createStory(@Body() storyData: CreateStoryDto): Promise<Story> {
    return this.storyService.createStory(storyData);
  }

  @Patch(':id')
  async updateStory(@Param('id') id: number, @Body() storyData: PatchStoryDto): Promise<Story> {
    const updatedStory = await this.storyService.updateStory(id, storyData);
    if (!updatedStory) {
      throw new NotFoundException(`História com ID ${id} não encontrada`);
    }
    return updatedStory;
  }

  @Delete(':id')
  async deleteStory(@Param('id') id: number): Promise<void> {
    const deletedStory = await this.storyService.deleteStory(id);
    if (!deletedStory) {
      throw new NotFoundException(`História com ID ${id} não encontrada`);
    }
  }
}
