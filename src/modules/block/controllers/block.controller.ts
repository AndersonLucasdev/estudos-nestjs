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
  async countBlocksByUserId(@Param('userId') userId: number): Promise<number> {
    try {
      return await this.blockService.countBlocksByUserId(userId);
    } catch (error) {
      throw new NotFoundException('Failed to count blocks for the user.');
    }
  }

  @Get('findBlockedUsers/:userId')
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
