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
import { TagService } from '../services/tag.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from '@prisma/client';
import { CreateTagDto } from '../dto/CreateTag.dto';
import { PatchTagDto } from '../dto/PatchTag.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(':id')
  async getTagById(@Param('id', ParseIntPipe) id: number) {
    try {
      const tag = await this.tagService.getTagById(id);
      if (!tag) {
        throw new NotFoundException('Tag not found.');
      }
      return {tag}
    } catch (error) {
      throw new NotFoundException('Tag not found.');
    }
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    try {
      const tag = await this.tagService.createTag(createTagDto);
      return {tag}
    } catch (error) {
      throw new BadRequestException('Error creating a tag.');
    }
  }


  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number){
    try {
      await this.tagService.deleteTag(id);
      return { message: 'Tag deleted successfully.' };
    } catch (error) {
      throw new NotFoundException('Tag not found.');
    }
  }

  @Patch(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchTagDto: PatchTagDto,
  ) {
    try {
      const tag = await this.tagService.updateTag(id, patchTagDto);
      if (!tag) {
        throw new NotFoundException('Tag not found.');
      }
      return { tag };
    } catch (error) {
      throw new NotFoundException('Tag not found.');
    }
  }

  @Get('user/:userId')
  async getUserTags(@Param('userId', ParseIntPipe) userId: number): Promise<Tag[]> {
    return this.tagService.getUserTags(userId);
  }

  @Get('post/:postId')
  async getPostTags(@Param('postId', ParseIntPipe) postId: number): Promise<Tag[]> {
    return this.tagService.getPostTags(postId);
  }

  @Get('comment/:commentId')
  async getCommentTags(@Param('commentId', ParseIntPipe) commentId: number): Promise<Tag[]> {
    return this.tagService.getCommentTags(commentId);
  }

  @Get('story/:storyId')
  async getStoryTags(@Param('storyId', ParseIntPipe) storyId: number): Promise<Tag[]> {
    return this.tagService.getStoryTags(storyId);
  }
}
