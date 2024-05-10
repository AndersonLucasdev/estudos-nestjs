import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { BlockService } from '../services/block.service';
import { CreateBlockDto } from '../dto/CreateBlock.dto';
import { PatchBlockDto } from '../dto/PatchBlock.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
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

@Controller('blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post(':userId/:blockedUserId')
  @ApiOperation({ summary: 'Create a block' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({ name: 'blockedUserId', description: 'ID of the blocked user', type: Number })
  @ApiResponse({ status: 201, description: 'Block created successfully.' })
  @ApiConflictResponse({ description: 'User already blocked.' })
  async createBlock(
    @Param('userId') userId: number,
    @Param('blockedUserId') blockedUserId: number,
  ): Promise<void> {
    try {
      await this.blockService.createBlock(userId, blockedUserId);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already blocked.');
      }
      throw error;
    }
  }

  @Delete(':userId/:blockedUserId')
  @ApiOperation({ summary: 'Unlock a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({ name: 'blockedUserId', description: 'ID of the blocked user', type: Number })
  @ApiResponse({ status: 200, description: 'User unlocked successfully.' })
  @ApiNotFoundResponse({ description: 'Block not found.' })
  async unlockUser(
    @Param('userId') userId: number,
    @Param('blockedUserId') blockedUserId: number,
  ): Promise<void> {
    try {
      await this.blockService.unlockUser(userId, blockedUserId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Block not found.');
      }
      throw error;
    }
  }

  @Get('count/:userId')
  @ApiOperation({ summary: 'Count blocks by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Block count obtained successfully.' })
  @ApiNotFoundResponse({ description: 'Failed to count blocks for the user.' })
  async countBlocksByUserId(@Param('userId') userId: number): Promise<number> {
    try {
      return await this.blockService.countBlocksByUserId(userId);
    } catch (error) {
      throw new NotFoundException('Failed to count blocks for the user.');
    }
  }

  @Get('findBlockedUsers/:userId')
  @ApiOperation({ summary: 'Find blocked users by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Blocked users found successfully.' })
  @ApiNotFoundResponse({ description: 'Failed to find blocked users for the user.' })
  async findBlockedUsers(@Param('userId') userId: number): Promise<number[]> {
    try {
      const blockedUsers = await this.blockService.findBlockedUsers(userId);
      const blockedUserIds = blockedUsers.map(
        (blockedUser) => blockedUser.blockedUserId,
      );
      return blockedUserIds;
    } catch (error) {
      throw new NotFoundException('Failed to find blocked users for the user.');
    }
  }
}
