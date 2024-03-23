import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateConversationDto } from '../dto/CreateConversation.dto';
import { ConversationService } from '../services/conversation.service';

@Controller('comment-like')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
}
