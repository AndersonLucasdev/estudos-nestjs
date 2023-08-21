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
  import { NotificationService } from '../services/notification.service';
//   import { CreateMessageDto } from '../dto/CreateMessage.dto';
  import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
  import { Notification } from '@prisma/client';
//   import { PatchMessageDto } from '../dto/PatchMessage.dto';
  
  @Controller('notifications')
  export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

  }