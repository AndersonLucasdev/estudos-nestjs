import {
  Injectable,
  Post,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFollowers } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class UserFollowersService {
  constructor(private readonly prisma: PrismaService, private readonly webSocketService: WebSocketService,) {}

  // Method: Check if a user is following another user
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

  // Method: Count the number of followers for a specific user
  async CountFollowers(userId: number): Promise<number> {
    const followersCount = await this.prisma.userFollowers.count({
      where: { relatedUserId: userId },
    });

    return followersCount;
  }

  // Method: Count the number of users a specific user is following
  async CountFollowing(userId: number): Promise<number> {
    const followingCount = await this.prisma.userFollowers.count({
      where: { userId: userId },
    });

    return followingCount;
  }

  // Method: List common followers between two users
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

  // Method: Create a new follow relationship between users
  async CreateFollowers(
    userId: number,
    relatedUserId: number,
  ): Promise<UserFollowers> {
    const follow = await this.prisma.userFollowers.create({
      data: {
        userId: userId,
        relatedUserId: relatedUserId,
      },
    });

    return follow;
  }

  // Method: Unfollow a user by deleting the follow relationship
  async Unfollow(
    userId: number,
    relatedUserId: number,
  ): Promise<UserFollowers> {
    const unfollowed = await this.prisma.userFollowers.deleteMany({
      where: {
        userId: userId,
        relatedUserId: relatedUserId,
      },
    });

    if (unfollowed.count === 0) {
      throw new NotFoundException('Seguidor não encontrado.');
    }

    return unfollowed[0];
  }
}
