import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFollowers } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class UserFollowersService {
  constructor(private readonly prisma: PrismaService) {}

  async CheckIfFollowing(
    followerId: number,
    followedId: number,
  ): Promise<boolean> {
    const userFollow = await this.prisma.userFollowers.findFirst({
      where: {
        userId: followerId,
        relatedUserId: followedId,
      },
    });

    return userFollow !== null;
  }

  async CountFollowers(userId: number): Promise<number> {
    const followersCount = await this.prisma.userFollowers.count({
      where: { relatedUserId: userId },
    });

    return followersCount;
  }

  async CountFollowing(userId: number): Promise<number> {
    const followingCount = await this.prisma.userFollowers.count({
      where: { userId: userId },
    });

    return followingCount;
  }

  async ListCommonFollowers(user1Id: number, user2Id: number) {
    const commonFollowers = await this.prisma.userFollowers.findMany({
      where: {
        userId: user1Id,
        relatedUserId: user2Id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  
    return commonFollowers;
  }

  
}
