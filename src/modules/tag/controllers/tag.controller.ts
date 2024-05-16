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
  async getTagById(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagService.getTagById(id);
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(createTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tagService.deleteTag(id);
  }

  @Patch(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchTagDto: PatchTagDto,
  ): Promise<Tag> {
    return this.tagService.updateTag(id, patchTagDto);
  }

  @Get('user/:userId')
  async getUserTags(@Param('userId', ParseIntPipe) userId: number): Promise<Tag[]> {
    return this.tagService.getUserTags(userId);
  }

  @Get('post/:postId')
  async getPostTags(@Param('postId', ParseIntPipe) postId: number): Promise<Tag[]> {
    return this.tagService.getPostTags(postId);
  }
}
