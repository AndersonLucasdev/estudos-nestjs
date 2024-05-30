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
      throw new NotFoundException(`Feedback not found.`);
    }
    return feedback;
  }

  async createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    try {
      const feedback = await this.prisma.feedback.create({
        data: createFeedbackDto,
      });
      return feedback;
    } catch (error) {
      throw new ConflictException('Error creating feedback.');
    }
  }

  async updateFeedback(id: number, patchFeedbackDto: PatchFeedbackDto): Promise<Feedback> {
    try {
      const feedback = await this.prisma.feedback.update({
        where: { id },
        data: patchFeedbackDto,
      });
      return feedback;
    } catch (error) {
      throw new NotFoundException(`Feedback not found.`);
    }
  }

  async deleteFeedback(id: number): Promise<void> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback not found.`);
    }
    await this.prisma.feedback.delete({
      where: { id },
    });
  }
}
