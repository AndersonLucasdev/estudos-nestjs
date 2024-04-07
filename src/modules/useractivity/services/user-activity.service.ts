import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActivity } from '@prisma/client';
import { UserActivityType } from '@prisma/client';
import { CreateUserActivityDto } from '../dto/CreateUserActivity.dto';
import { PatchUserActivityDto } from '../dto/PatchUserActivity.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class UserActivityService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return this.prisma.userActivity.findMany({
      where: {
        userId,
      },
    });
  }

  async getUserActivityById(activityId: number): Promise<UserActivity> {
    const activity = await this.prisma.userActivity.findUnique({
      where: {
        id: activityId,
      },
    });
    if (!activity) {
      throw new NotFoundException('User activity not found.');
    }
    return activity;
  }

  async getUserActivitiesByType(userId: number, activityType: UserActivityType): Promise<UserActivity[]> {
    return this.prisma.userActivity.findMany({
      where: {
        userId,
        activityType,
      },
    });
  }

  async createUserActivity(createUserActivityDto: CreateUserActivityDto): Promise<UserActivity> {
    try {
      const createdActivity = await this.prisma.userActivity.create({
        data: createUserActivityDto,
      });
      return createdActivity;
    } catch (error) {
      throw new ConflictException('Failed to create user activity.');
    }
  }

  async updateUserActivity(activityId: number, patchUserActivityDto: PatchUserActivityDto): Promise<UserActivity> {
    const existingActivity = await this.getUserActivityById(activityId);
    try {
      const updatedActivity = await this.prisma.userActivity.update({
        where: {
          id: activityId,
        },
        data: patchUserActivityDto,
      });
      return updatedActivity;
    } catch (error) {
      throw new BadRequestException('Failed to update user activity.');
    }
  }

  async deleteUserActivity(activityId: number): Promise<void> {
    const existingActivity = await this.getUserActivityById(activityId);
    try {
      await this.prisma.userActivity.delete({
        where: {
          id: activityId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete user activity.');
    }
  }
}
