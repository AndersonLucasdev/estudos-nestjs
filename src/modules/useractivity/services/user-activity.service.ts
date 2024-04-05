import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActivity } from '@prisma/client';
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

  
}