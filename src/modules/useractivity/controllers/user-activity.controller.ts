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
  Query,
} from '@nestjs/common';
import { UserActivityService } from '../services/user-activity.service';
import { UserActivity } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { UserActivityType } from '@prisma/client';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { PatchUserActivityDto } from '../dto/PatchUserActivity.dto';
import { CreateUserActivityDto } from '../dto/CreateUserActivity.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('User Activities')
@Controller('posts')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get('/:userId')
  @ApiOperation({ summary: 'Get user activities' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User activities found',
    type: CreateUserActivityDto,
    isArray: true,
  })
  async getUserActivities(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserActivity[]> {
    try {
      const activities = await this.userActivityService.getUserActivities(
        userId,
      );
      if (!activities || activities.length === 0) {
        throw new NotFoundException('User activities not found.');
      }
      return activities;
    } catch (error) {
      throw new NotFoundException('User activities not found.');
    }
  }

  @Get('/:activityId')
  @ApiOperation({ summary: 'Get user activity by ID' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  @ApiResponse({
    status: 200,
    description: 'User activity found',
    type: CreateUserActivityDto,
  })
  @ApiNotFoundResponse({ description: 'User activity not found' })
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
    @Param('activityType') activityType: UserActivityType,
  ): Promise<UserActivity[]> {
    try {
      const activities = await this.userActivityService.getUserActivitiesByType(
        userId,
        activityType,
      );
      if (!activities || activities.length === 0) {
        throw new NotFoundException('User activities not found.');
      }
      return activities;
    } catch (error) {
      throw new NotFoundException('User activities not found.');
    }
  }

  @Get('/:userId/type/:activityType/count')
  async countUserActivitiesByType(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('activityType') activityType: UserActivityType,
  ): Promise<number> {
    try {
      return await this.userActivityService.countUserActivitiesByType(
        userId,
        activityType,
      );
    } catch (error) {
      throw new NotFoundException('User activities not found.');
    }
  }

  @Get('/:userId/filter')
  async filterUserActivitiesByDate(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<UserActivity[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'Both start date and end date are required.',
      );
    }
    return this.userActivityService.filterUserActivitiesByDate(
      userId,
      startDate,
      endDate,
    );
  }

  @Get('/:userId/recent')
  async getRecentUserActivities(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit: number = 10,
  ): Promise<UserActivity[]> {
    try {
      const activities = await this.userActivityService.getRecentUserActivities(
        userId,
        limit,
      );
      if (!activities || activities.length === 0) {
        throw new NotFoundException('Recent user activities not found.');
      }
      return activities;
    } catch (error) {
      throw new NotFoundException('Recent user activities not found.');
    }
  }

  @Get('/:userId/delete-old')
  async deleteOldUserActivities(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('cutoffDate') cutoffDate: Date,
  ): Promise<void> {
    if (!cutoffDate) {
      throw new BadRequestException('Cutoff date is required.');
    }
    return this.userActivityService.deleteOldUserActivities(userId, cutoffDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create user activity' })
  @ApiBody({ type: CreateUserActivityDto })
  @ApiResponse({
    status: 201,
    description: 'User activity created',
    type: CreateUserActivityDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiConflictResponse({ description: 'Failed to create user activity' })
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
  @ApiOperation({ summary: 'Update user activity' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  @ApiBody({ type: PatchUserActivityDto })
  @ApiResponse({
    status: 200,
    description: 'User activity updated',
    type: CreateUserActivityDto,
  })
  @ApiNotFoundResponse({ description: 'User activity not found' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
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
  @ApiOperation({ summary: 'Delete user activity' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  @ApiResponse({ status: 204, description: 'User activity deleted' })
  @ApiNotFoundResponse({ description: 'User activity not found' })
  @ApiBadRequestResponse({ description: 'Failed to delete user activity' })
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
