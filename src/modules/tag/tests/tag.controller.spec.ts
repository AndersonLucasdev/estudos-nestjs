import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '../controllers/tag.controller';
import { TagService } from '../services/tag.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            getTagById: jest.fn(),
            createTag: jest.fn(),
            deleteTag: jest.fn(),
            updateTag: jest.fn(),
            getUserTags: jest.fn(),
            getPostTags: jest.fn(),
            getCommentTags: jest.fn(),
            getStoryTags: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });
});
