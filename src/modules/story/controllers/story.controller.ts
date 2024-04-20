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
import { StoryService } from '../services/story.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/CreatUser.dto';
import { PatchUserDto } from 'src/modules/user/dto/PatchUser.dto';
import { WebSocketService } from 'src/modules/websocket/websocket.service';


export class StoryController {
  constructor(private readonly storyService: StoryService) {}
}
