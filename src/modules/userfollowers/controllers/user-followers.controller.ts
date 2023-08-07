import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
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
import { UserFollowersService } from '../services/user-followers.service';

@Controller('comment-like')
export class UserFollowersController {
  constructor(private readonly userFollowersService: UserFollowersService) {}

  // EndPoint: Check if a user is following another user
  @Get(':followerId/following/:followedId')
  async checkIfFollowing(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const isFollowing = await this.userFollowersService.CheckIfFollowing(followerId, followedId);
    return { isFollowing };
  }

  // EndPoint: Get the count of followers for a specific user
  @Get(':userId/followers/count')
  async countFollowers(@Param('userId') userId: number) {
    const followersCount = await this.userFollowersService.CountFollowers(userId);
    return { followersCount };
  }

  // EndPoint: Get the count of users a specific user is following
  @Get(':userId/following/count')
  async countFollowing(@Param('userId') userId: number) {
    const followingCount = await this.userFollowersService.CountFollowing(userId);
    return { followingCount };
  }

  // EndPoint: List common followers between two users
  @Get(':user1Id/common-followers/:user2Id')
  async listCommonFollowers(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
  ) {
    const commonFollowers = await this.userFollowersService.ListCommonFollowers(user1Id, user2Id);
    return commonFollowers;
  }

  // EndPoint: Follow a user by creating a follow relationship
  @Post(':followerId/follow/:followedId')
  async followUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const follow = await this.userFollowersService.CreateFollowers(followerId, followedId);
    return follow;
  }

  // EndPoint: Unfollow a user by deleting the follow relationship
  @Delete(':followerId/unfollow/:followedId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const unfollow = await this.userFollowersService.Unfollow(followerId, followedId);
    return unfollow;
  }  
}
