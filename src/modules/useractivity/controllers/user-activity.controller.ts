import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { UserActivityService } from '../services/user-activity.service';
import { TrimSpaces } from 'src/utils/helpers';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('posts')
export class UserActivityController {
    constructor(private readonly userActivityService: UserActivityService) {}
}
