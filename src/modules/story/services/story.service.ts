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
import { Message } from '@prisma/client';
import { User } from '@prisma/client';

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

  async getStoriesByUserId(userId: number): Promise<Story[]> {
    const stories = await this.prisma.story.findMany({
      where: { userId },
    });
    return stories;
  }

  async getLast24HoursStoriesByUser(userId: number): Promise<Story[]> {
    const currentDateTime = new Date();
    const twentyFourHoursAgo = new Date(currentDateTime);
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1); // limite 24h

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
    const updatedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: { viewCount: { increment: 1 } },
    });
    return updatedStory;
  }

  async getUsersWhoViewedStory(storyId: number): Promise<User[]> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: { user: true },
    });
    if (!story || !story.user) {
      throw new NotFoundException(`Story não encontrada: ID ${storyId}`);
    }
    return [story.user]; // Retorna lista com users
  }

  async getStoryReplies(storyId: number): Promise<Message[]> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: { replies: true },
    });
    if (!story) {
      throw new NotFoundException(`História não encontrada: ID ${storyId}`);
    }
    return story.replies;
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
      throw new NotFoundException(`Story não encontrada: ID ${id}`);
    }
    return updatedStory;
  }

  async DeleteStory(id: number): Promise<void> {
    const deletedStory = await this.prisma.story.delete({ where: { id } });
    if (!deletedStory) {
      throw new NotFoundException(`Story não encontrada: ID ${id}`);
    }
  }
}
