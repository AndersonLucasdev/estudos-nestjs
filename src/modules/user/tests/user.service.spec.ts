import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { UserActivityType } from '@prisma/client';
import { NotificationType } from '@prisma/client';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';