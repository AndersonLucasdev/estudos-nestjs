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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag', type: Number })
  @ApiResponse({ status: 200, description: 'Tag found successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
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
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Tag created successfully.' })
  @ApiResponse({ status: 400, description: 'Error creating tag.' })
  async createTag(@Body() createTagDto: CreateTagDto) {
    try {
      const tag = await this.tagService.createTag(createTagDto);
      return {tag}
    } catch (error) {
      throw new BadRequestException('Error creating a tag.');
    }
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag', type: Number })
  @ApiResponse({ status: 200, description: 'Tag removed successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async deleteTag(@Param('id', ParseIntPipe) id: number){
    try {
      await this.tagService.deleteTag(id);
      return { message: 'Tag deleted successfully.' };
    } catch (error) {
      throw new NotFoundException('Tag not found.');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tag', type: Number })
  @ApiBody({ type: PatchTagDto })
  @ApiResponse({ status: 200, description: 'Tag updated successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
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
  async getUserTags(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const tags = await this.tagService.getUserTags(userId);
      if (!tags || tags.length === 0) {
        throw new NotFoundException('Tags not found for user.');
      }
      return { tags };
    } catch (error) {
      throw new NotFoundException('Tags not found for user.');
    }
  }

  @Get('post/:postId')
  async getPostTags(@Param('postId', ParseIntPipe) postId: number) {
    try {
      const tags = await this.tagService.getPostTags(postId);
      if (!tags || tags.length === 0) {
        throw new NotFoundException('Tags not found for user.');
      }
      return { tags };
    } catch (error) {
      throw new NotFoundException('Tags not found for user.');
    }
  }

  @Get('comment/:commentId')
  async getCommentTags(@Param('commentId', ParseIntPipe) commentId: number) {
    try {
      const tags = await this.tagService.getCommentTags(commentId);
      if (!tags || tags.length === 0) {
        throw new NotFoundException('Tags not found for comment.');
      }
      return { tags };
    } catch (error) {
      throw new NotFoundException('Tags not found for comment.');
    }
  }

  @Get('story/:storyId')
  async getStoryTags(@Param('storyId', ParseIntPipe) storyId: number) {
    try {
      const tags = await this.tagService.getStoryTags(storyId);
      if (!tags || tags.length === 0) {
        throw new NotFoundException('Tags not found for stories.');
      }
      return { tags };
    } catch (error) {
      throw new NotFoundException('Tags not found for stories.');
    }
  }
}
