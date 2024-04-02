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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns notifications for the specified user' })
  async getNotificationsByUserId(@Param('userId') userId: number): Promise<Notification[]> {
    return await this.notificationService.getNotificationsByUserId(userId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the notification with the specified ID' })
  async getNotificationById(@Param('id') id: number): Promise<Notification> {
    return await this.notificationService.getNotificationById(id);
  }

  @Patch(':id/mark-as-read')
  @ApiOperation({ summary: 'Mark notification as read by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the updated notification marked as read' })
  async markNotificationAsRead(@Param('id') id: number): Promise<Notification> {
    try {
      return await this.notificationService.markNotificationAsRead(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('user/:userId/unread-count')
  async countUnreadNotifications(@Param('userId') userId: number): Promise<number> {
    try {
      return await this.notificationService.countUnreadNotifications(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('user/:userId/recent/:limit')
  async getRecentNotifications(
    @Param('userId') userId: number,
    @Param('limit') limit: number,
  ): Promise<Notification[]> {
    try {
      return await this.notificationService.getRecentNotifications(userId, limit);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ status: 201, description: 'Returns the newly created notification' })
  async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationService.createNotification(createNotificationDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID', type: Number })
  @ApiResponse({ status: 204, description: 'Notification successfully deleted' })
  async deleteNotification(@Param('id') id: number): Promise<void> {
    return await this.notificationService.deleteNotification(id);
  }
}
