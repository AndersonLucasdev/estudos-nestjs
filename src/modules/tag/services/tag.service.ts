import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from '@prisma/client';
import { CreateTagDto } from '../dto/CreateTag.dto';
import { PatchTagDto } from '../dto/PatchTag.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class TagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async getTagById(id: number): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    return tag;
  }

  async getUserTags(userId: number): Promise<Tag[]> {
    const userTags = await this.prisma.tag.findMany({
      where: { userId },
    });
    if (!userTags) {
      throw new NotFoundException('Tag not found.');
    }
    return userTags;
  }

  async getPostTags(postId: number): Promise<Tag[]> {
    const postTags = await this.prisma.tag.findMany({
      where: { postId },
    });
    if (!postTags) {
      throw new NotFoundException('Tag not found.');
    }
    return postTags;
  }

  async getCommentTags(commentId: number): Promise<Tag[]> {
    const commentTags = await this.prisma.tag.findMany({
      where: { commentId },
    });
    if (!commentTags) {
      throw new NotFoundException('Tag not found.');
    }
    return commentTags;
  }

  async getStoryTags(storyId: number): Promise<Tag[]> {
    const storyTags = await this.prisma.tag.findMany({
      where: { storyId },
    });
    if (!storyTags) {
      throw new NotFoundException('Tag not found.');
    }
    return storyTags;
  }

  async createTag(CreateTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: CreateTagDto,
    });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    return tag;
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    await this.prisma.tag.delete({ where: { id } });
  }

  async patchTag(id: number, patchTagDto: PatchTagDto): Promise<Tag> {
    let tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    tag = await this.prisma.tag.update({
      where: { id },
      data: patchTagDto,
    });
    return tag;
  }

}
