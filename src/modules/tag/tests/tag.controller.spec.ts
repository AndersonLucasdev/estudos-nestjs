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

  describe('getTagById', () => {
    it('should return a tag by ID', async () => {
      const mockTag = { id: 1, name: 'Test Tag' };
      jest.spyOn(service, 'getTagById').mockResolvedValue(mockTag);

      const result = await controller.getTagById(1);
      expect(result).toEqual({ tag: mockTag });
      expect(service.getTagById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(service, 'getTagById').mockResolvedValue(null);

      await expect(controller.getTagById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { name: 'New Tag' };
      const mockTag = { id: 1, ...createTagDto };
      jest.spyOn(service, 'createTag').mockResolvedValue(mockTag);

      const result = await controller.createTag(createTagDto);
      expect(result).toEqual({ tag: mockTag });
      expect(service.createTag).toHaveBeenCalledWith(createTagDto);
    });

    it('should throw BadRequestException if error creating tag', async () => {
      jest.spyOn(service, 'createTag').mockRejectedValue(new Error('Error'));

      await expect(controller.createTag({ name: 'New Tag' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  
});
