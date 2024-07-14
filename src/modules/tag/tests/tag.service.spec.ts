import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../services/tag.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from '../dto/CreateTag.dto';
import { PatchTagDto } from '../dto/PatchTag.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Tag } from '@prisma/client';
import { Gender } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('TagService', () => {
  let service: TagService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: PrismaService,
          useValue: {
            tag: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: WebSocketService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getTagById', () => {
    it('should return a tag by ID', async () => {
      const mockTag: Tag = {
        id: 1,
        createdAt: new Date(),
        taggedUserId: 1,
        userId: 1,
        postId: null,
        commentId: null,
        storyId: null,
      };
      jest.spyOn(prisma.tag, 'findUnique').mockResolvedValue(mockTag);

      const result = await service.getTagById(1);
      expect(result).toEqual(mockTag);
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(prisma.tag, 'findUnique').mockResolvedValue(null);

      await expect(service.getTagById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const createTagDto = { taggedUserId: 1, userId: 1, postId: null, commentId: null, storyId: null, createdAt: new Date() };
      const mockTag: Tag = { id: 1, ...createTagDto };
      jest.spyOn(prisma.tag, 'create').mockResolvedValue(mockTag);

      const result = await service.createTag(createTagDto);
      expect(result).toEqual(mockTag);
      expect(prisma.tag.create).toHaveBeenCalledWith({ data: createTagDto });
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag by ID', async () => {
      const mockTag: Tag = { id: 1, createdAt: new Date(), taggedUserId: 1, userId: 1, postId: null, commentId: null, storyId: null };
      jest.spyOn(prisma.tag, 'findUnique').mockResolvedValue(mockTag);
      jest.spyOn(prisma.tag, 'delete').mockResolvedValue(mockTag);

      await service.deleteTag(1);
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(prisma.tag, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteTag(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('patchTag', () => {
    it('should update a tag by ID', async () => {
      const patchTagDto: PatchTagDto = {
        createdAt: new Date(),
        taggedUserId: 2,
        userId: 3,
        postId: 4,
        commentId: 5,
        storyId: 6,
      };
      const mockTag: Tag = { id: 1, ...patchTagDto,  };
      jest.spyOn(prisma.tag, 'findUnique').mockResolvedValue(mockTag);
      jest.spyOn(prisma.tag, 'update').mockResolvedValue(mockTag);

      const result = await service.patchTag(1, patchTagDto);
      expect(result).toEqual(mockTag);
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.tag.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: patchTagDto,
      });
    });
});
