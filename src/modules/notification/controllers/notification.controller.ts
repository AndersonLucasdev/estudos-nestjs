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
import { CreateNotificationDto } from '../dto/CreateNotification.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { Notification } from '@prisma/client';
import { PatchNotificationDto } from '../dto/PatchNotification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:userId')
  async getNotificationsByUserId(@Param('userId') userId: number): Promise<Notification[]> {
    return this.notificationService.getNotificationsByUserId(userId);
  }

  @Get('/:id')
  async getNotificationById(@Param('id') id: number): Promise<Notification> {
    return this.notificationService.getNotificationById(id);
  }

  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Delete('/:id')
  async deleteNotification(@Param('id') id: number): Promise<void> {
    return this.notificationService.deleteNotification(id);
  }
}
