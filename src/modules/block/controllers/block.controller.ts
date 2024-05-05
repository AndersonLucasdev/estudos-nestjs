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
}
