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

  
}
