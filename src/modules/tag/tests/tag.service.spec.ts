import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../services/tag.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from '../dto/CreateTag.dto';
import { PatchTagDto } from '../dto/PatchTag.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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
      const mockTag: Tag = { id: 1, createdAt: new Date(), taggedUserId: 1, userId: 1, postId: null, commentId: null, storyId: null };
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
});
