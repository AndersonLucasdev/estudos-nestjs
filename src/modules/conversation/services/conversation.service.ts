import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { Conversation } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class ConvesationService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

}
