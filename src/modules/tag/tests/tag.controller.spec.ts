import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '../controllers/tag.controller';
import { TagService } from '../services/tag.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
import { CreateTagDto } from '../dto/CreateTag.dto';
import { PatchTagDto } from '../dto/PatchTag.dto';
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
            patchtag: jest.fn(),
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
      const mockTag = {
        id: 1,
        name: 'Test Tag',
        createdAt: new Date(),
        taggedUserId: 1,
        userId: 1,
        postId: null,
        commentId: null,
        storyId: null,
      };
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
      const createTagDto: CreateTagDto = {
        createdAt: new Date(),
        taggedUserId: 1,
        userId: 1,
        postId: null,
        commentId: null,
        storyId: null,
      };

      const mockTag = {
        id: 1,
        createdAt: new Date(),
        taggedUserId: 1,
        userId: 1,
        postId: null,
        commentId: null,
        storyId: null,
      };
      jest.spyOn(service, 'createTag').mockResolvedValue(mockTag);

      const result = await controller.createTag(createTagDto);
      expect(result).toEqual({ tag: mockTag });
      expect(service.createTag).toHaveBeenCalledWith(createTagDto);
    });

    it('should throw BadRequestException if error creating tag', async () => {
      const createTagDto: CreateTagDto = {
        createdAt: new Date(),
        taggedUserId: 1,
        userId: 1,
        postId: null,
        commentId: null,
        storyId: null,
      };
      jest.spyOn(service, 'createTag').mockRejectedValue(new Error('Error'));

      await expect(controller.createTag(createTagDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag by ID', async () => {
      jest.spyOn(service, 'deleteTag').mockResolvedValue(undefined);

      const result = await controller.deleteTag(1);
      expect(result).toEqual({ message: 'Tag deleted successfully.' });
      expect(service.deleteTag).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest
        .spyOn(service, 'deleteTag')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteTag(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('patchtag', () => {
    it('should update a tag by ID', async () => {
      const patchTagDto: PatchTagDto = { name: 'Updated Tag' };
      const mockTag = { id: 1, ...patchTagDto };
      jest.spyOn(service, 'patchTag').mockResolvedValue(mockTag);

      const result = await controller.patchTag(1, patchTagDto);
      expect(result).toEqual({ tag: mockTag });
      expect(service.patchTag).toHaveBeenCalledWith(1, patchTagDto);
    });

    it('should throw NotFoundException if tag not found', async () => {
      const patchTagDto: PatchTagDto = { name: 'Updated Tag' };
      jest
        .spyOn(service, 'patchTag')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.patchTag(1, patchTagDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
