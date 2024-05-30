import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from '../dto/CreateFeedback.dto';
import { PatchFeedbackDto } from '../dto/PatchFeedback.dto';
import { Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}
}
