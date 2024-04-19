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
      throw new NotFoundException('História não encontrada.');
    }
    return story;
  }

  async CreateStory(storyData: CreateStoryDto): Promise<Story> {
    const createdStory = await this.prisma.story.create({ data: storyData });
    return createdStory;
  }

  async UpdateStory(id: number, storyData: PatchStoryDto): Promise<Story> {
    const updatedStory = await this.prisma.story.update({
      where: { id },
      data: storyData,
    });
    if (!updatedStory) {
      throw new NotFoundException(`História com ID ${id} não encontrada`);
    }
    return updatedStory;
  }

  async DeleteStory(id: number): Promise<void> {
    const deletedStory = await this.prisma.story.delete({ where: { id } });
    if (!deletedStory) {
      throw new NotFoundException(`História com ID ${id} não encontrada`);
    }
  }
}
