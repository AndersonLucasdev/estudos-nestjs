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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('User Followers')
@Controller('userfollower')
export class UserFollowersController {
  constructor(private readonly userFollowersService: UserFollowersService) {}

  // EndPoint: Check if a user is following another user
  @Get(':followerId/following/:followedId')
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiParam({
    name: 'followerId',
    description: 'ID of the follower user',
    type: Number,
  })
  @ApiParam({
    name: 'followedId',
    description: 'ID of the followed user',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Check result obtained successfully.',
  })
  async checkIfFollowing(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    try {
      const isFollowing = await this.userFollowersService.CheckIfFollowing(
        followerId,
        followedId,
      );
      return { isFollowing };
    } catch (error) {
      throw new NotFoundException('Error checking if user is following.');
    }
  }

  // EndPoint: Get the count of followers for a specific user
  @Get(':userId/followers/count')
  @ApiOperation({ summary: 'Get the count of followers for a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Followers count obtained successfully.',
  })
  async countFollowers(@Param('userId') userId: number) {
    try {
      const followersCount = await this.userFollowersService.CountFollowers(
        userId,
      );
      return { followersCount };
    } catch (error) {
      throw new NotFoundException('Error counting followers.');
    }
  }

  // EndPoint: Get the count of users a specific user is following
  @Get(':userId/following/count')
  @ApiOperation({
    summary: 'Get the count of users a specific user is following',
  })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Following count obtained successfully.',
  })
  async countFollowing(@Param('userId') userId: number) {
    try {
      const followingCount = await this.userFollowersService.CountFollowing(
        userId,
      );
      return { followingCount };
    } catch (error) {
      throw new NotFoundException('Error counting following users.');
    }
  }

  // EndPoint: List common followers between two users
  @Get(':user1Id/common-followers/:user2Id')
  @ApiOperation({ summary: 'List common followers between two users' })
  @ApiParam({
    name: 'user1Id',
    description: 'ID of the first user',
    type: Number,
  })
  @ApiParam({
    name: 'user2Id',
    description: 'ID of the second user',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Common followers list obtained successfully.',
  })
  async listCommonFollowers(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
  ) {
    try {
      const commonFollowers =
        await this.userFollowersService.ListCommonFollowers(user1Id, user2Id);
      return commonFollowers;
    } catch (error) {
      throw new NotFoundException('Error listing common followers.');
    }
  }

  // EndPoint: Follow a user by creating a follow relationship
  @Post(':followerId/follow/:followedId')
  @ApiOperation({ summary: 'Follow a user by creating a follow relationship' })
  @ApiParam({
    name: 'followerId',
    description: 'ID of the follower user',
    type: Number,
  })
  @ApiParam({
    name: 'followedId',
    description: 'ID of the followed user',
    type: Number,
  })
  @ApiResponse({ status: 201, description: 'User followed successfully.' })
  async followUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    try {
      const follow = await this.userFollowersService.CreateFollowers(
        followerId,
        followedId,
      );
      return follow;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already followed.');
      }
      throw error;
    }
  }

  // EndPoint: Unfollow a user by deleting the follow relationship
  @Delete(':followerId/unfollow/:followedId')
  @ApiOperation({
    summary: 'Unfollow a user by deleting the follow relationship',
  })
  @ApiParam({
    name: 'followerId',
    description: 'ID of the follower user',
    type: Number,
  })
  @ApiParam({
    name: 'followedId',
    description: 'ID of the followed user',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully.' })
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    try {
      const unfollow = await this.userFollowersService.Unfollow(
        followerId,
        followedId,
      );
      return unfollow;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Relationship not found.');
      }
      throw error;
    }
  }
}
