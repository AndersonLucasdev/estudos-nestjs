import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Story } from '@prisma/client';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async GetStoryById(id: number): Promise<Story> {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) {
      throw new NotFoundException('Story não encontrada.');
    }
    return story;
  }

  async getStoriesByUser(userId: number): Promise<Story[]> {
    const stories = await this.prisma.story.findMany({
      where: { userId },
    });
    return stories;
  }

  async getLast24HoursStoriesByUser(userId: number): Promise<Story[]> {
    const currentDateTime = new Date();
    const twentyFourHoursAgo = new Date(currentDateTime);
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1); // coloca um limite 24h

    const stories = await this.prisma.story.findMany({
      where: {
        userId,
        creationDate: {
          gte: twentyFourHoursAgo,
          lte: currentDateTime, // momento atual até 24 horas
        },
      },
    });
    return stories;
  }

  async incrementViewCount(storyId: number): Promise<Story> {
    const story = await this.getStoryById(storyId);
    const updatedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: { viewCount: story.viewCount + 1 },
    });
    return updatedStory;
  }

  async getUsersWhoViewedStory(storyId: number): Promise<string[]> {
    const story = await this.getStoryById(storyId);
    const viewers = await this.prisma.storyView.findMany({
      where: { storyId },
      select: { userId: true },
    });
    return viewers.map(viewer => viewer.userId);
  }

  async getStoryReplies(storyId: number): Promise<Message[]> {
    const story = await this.getStoryById(storyId);
    const replies = await this.prisma.message.findMany({
      where: { postId: storyId },
    });
    return replies;
  }

  async CreateStory(storyData: CreateStoryDto): Promise<Story> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    const createdStory = await this.prisma.story.create({ 
      data: { 
        ...storyData,
        expirationDate,
      } 
    });
    return createdStory;
  }

  async UpdateStory(id: number, storyData: PatchStoryDto): Promise<Story> {
    const updatedStory = await this.prisma.story.update({
      where: { id },
      data: storyData,
    });
    if (!updatedStory) {
      throw new NotFoundException(`Story com ID ${id} não encontrada`);
    }
    return updatedStory;
  }

  async DeleteStory(id: number): Promise<void> {
    const deletedStory = await this.prisma.story.delete({ where: { id } });
    if (!deletedStory) {
      throw new NotFoundException(`Story com ID ${id} não encontrada`);
    }
  }
}
