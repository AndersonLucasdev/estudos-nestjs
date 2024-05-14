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

  async createTag(CreateTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: CreateTagDto,
    });
    return tag;
  }

  async getTagById(id: number): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    return tag;
  }

  async updateTag(id: number, patchTagDto: PatchTagDto): Promise<Tag> {
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

  async deleteTag(id: number): Promise<void> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }
    await this.prisma.tag.delete({ where: { id } });
  }
}
