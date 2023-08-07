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

import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { formatUserData } from 'src/utils/FormartUserData';
import * as bcrypt from 'bcrypt';

@Controller('comment-like')
export class UserFollowersController {
  constructor(private readonly userFollowersService: UserFollowersService) {}

}
