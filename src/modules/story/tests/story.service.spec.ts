import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import { NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Story } from '@prisma/client';
import { Gender } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

