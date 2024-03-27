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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';


@ApiTags('User Followers')
@Controller('userfollower')
export class UserFollowersController {
  constructor(private readonly userFollowersService: UserFollowersService) {}

  // EndPoint: Check if a user is following another user
  @Get(':followerId/following/:followedId')
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiParam({ name: 'followerId', description: 'ID of the follower user', type: Number })
  @ApiParam({ name: 'followedId', description: 'ID of the followed user', type: Number })
  @ApiResponse({ status: 200, description: 'Check result obtained successfully.' })
  async checkIfFollowing(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const isFollowing = await this.userFollowersService.CheckIfFollowing(followerId, followedId);
    return { isFollowing };
  }

  // EndPoint: Get the count of followers for a specific user
  @Get(':userId/followers/count')
  @ApiOperation({ summary: 'Get the count of followers for a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Followers count obtained successfully.' })
  async countFollowers(@Param('userId') userId: number) {
    const followersCount = await this.userFollowersService.CountFollowers(userId);
    return { followersCount };
  }

  // EndPoint: Get the count of users a specific user is following
  @Get(':userId/following/count')
  @ApiOperation({ summary: 'Get the count of users a specific user is following' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Following count obtained successfully.' })
  async countFollowing(@Param('userId') userId: number) {
    const followingCount = await this.userFollowersService.CountFollowing(userId);
    return { followingCount };
  }

  // EndPoint: List common followers between two users
  @Get(':user1Id/common-followers/:user2Id')
  @ApiOperation({ summary: 'List common followers between two users' })
  @ApiParam({ name: 'user1Id', description: 'ID of the first user', type: Number })
  @ApiParam({ name: 'user2Id', description: 'ID of the second user', type: Number })
  @ApiResponse({ status: 200, description: 'Common followers list obtained successfully.' })
  async listCommonFollowers(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
  ) {
    const commonFollowers = await this.userFollowersService.ListCommonFollowers(user1Id, user2Id);
    return commonFollowers;
  }

  // EndPoint: Follow a user by creating a follow relationship
  @Post(':followerId/follow/:followedId')
  @ApiOperation({ summary: 'Follow a user by creating a follow relationship' })
  @ApiParam({ name: 'followerId', description: 'ID of the follower user', type: Number })
  @ApiParam({ name: 'followedId', description: 'ID of the followed user', type: Number })
  @ApiResponse({ status: 201, description: 'User followed successfully.' })
  async followUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const follow = await this.userFollowersService.CreateFollowers(followerId, followedId);
    return follow;
  }

  // EndPoint: Unfollow a user by deleting the follow relationship
  @Delete(':followerId/unfollow/:followedId')
  @ApiOperation({ summary: 'Unfollow a user by deleting the follow relationship' })
  @ApiParam({ name: 'followerId', description: 'ID of the follower user', type: Number })
  @ApiParam({ name: 'followedId', description: 'ID of the followed user', type: Number })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully.' })
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    const unfollow = await this.userFollowersService.Unfollow(followerId, followedId);
    return unfollow;
  }  
}
