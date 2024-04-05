import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { UserActivityService } from '../services/user-activity.service';
import { UserActivity } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('posts')
export class UserActivityController {
    constructor(private readonly userActivityService: UserActivityService) {}

    @Get('/:userId')
  async getUserActivities(@Param('userId') userId: number): Promise<UserActivity[]> {
    return this.userActivityService.getUserActivities(userId);
  }

  @Get('/:activityId')
  async getUserActivityById(@Param('activityId') activityId: number): Promise<UserActivity> {
    const activity = await this.userActivityService.getUserActivityById(activityId);
    if (!activity) {
      throw new NotFoundException('User activity not found.');
    }
    return activity;
  }
}
