import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from '../controllers/story.controller';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, UserActivityType } from '@prisma/client';
import { Gender } from '@prisma/client';
import { Story } from '@prisma/client';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';