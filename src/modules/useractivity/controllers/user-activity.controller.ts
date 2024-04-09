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
import { PatchUserActivityDto } from '../dto/PatchUserActivity.dto';
import { CreateUserActivityDto } from '../dto/CreateUserActivity.dto';

@Controller('posts')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get('/:userId')
  async getUserActivities(
    @Param('userId') userId: number,
  ): Promise<UserActivity[]> {
    return this.userActivityService.getUserActivities(userId);
  }

  @Get('/:activityId')
  async getUserActivityById(
    @Param('activityId') activityId: number,
  ): Promise<UserActivity> {
    const activity = await this.userActivityService.getUserActivityById(
      activityId,
    );
    if (!activity) {
      throw new NotFoundException('User activity not found.');
    }
    return activity;
  }

  @Get('/:userId/type/:activityType')
  async getUserActivitiesByType(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('activityType') activityType: UserActivityType
  ): Promise<UserActivity[]> {
    return this.userActivityService.getUserActivitiesByType(userId, activityType);
  }

  @Get('/:userId/type/:activityType/count')
  async countUserActivitiesByType(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('activityType') activityType: UserActivityType
  ): Promise<number> {
    return this.userActivityService.countUserActivitiesByType(userId, activityType);
  }


  @Post()
  async createUserActivity(
    @Body() createUserActivityDto: CreateUserActivityDto,
  ): Promise<UserActivity> {
    try {
      return this.userActivityService.createUserActivity(createUserActivityDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Failed to create user activity.');
      } else {
        throw new BadRequestException('Invalid data provided.');
      }
    }
  }

  @Patch('/:activityId')
  async updateUserActivity(
    @Param('activityId') activityId: number,
    @Body() patchUserActivityDto: PatchUserActivityDto,
  ): Promise<UserActivity> {
    try {
      return this.userActivityService.updateUserActivity(
        activityId,
        patchUserActivityDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User activity not found.');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data provided.');
      } else {
        throw new BadRequestException('Failed to update user activity.');
      }
    }
  }

  @Delete('/:activityId')
  async deleteUserActivity(
    @Param('activityId') activityId: number,
  ): Promise<void> {
    try {
      await this.userActivityService.deleteUserActivity(activityId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User activity not found.');
      } else {
        throw new BadRequestException('Failed to delete user activity.');
      }
    }
  }
}
