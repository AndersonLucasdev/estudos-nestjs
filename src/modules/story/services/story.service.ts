import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Story } from '@prisma/client';
import { CreateStoryDto } from '../dto/CreateStory.dto';
import { PatchStoryDto } from '../dto/PatchStory.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  
}
