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

  async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found.`);
    }
    return feedback;
  }
}
