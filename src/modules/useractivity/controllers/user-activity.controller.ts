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
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActivity } from '@prisma/client';
import { UserActivityService } from '../services/user-activity.service';
import { CreateUserActivityDto } from '../dto/CreateUserActivity.dto';
import { PatchUserActivityDto } from '../dto/PatchUserActivity.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces } from 'src/utils/helpers';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
