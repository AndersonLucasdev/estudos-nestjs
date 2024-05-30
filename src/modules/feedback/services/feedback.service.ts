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

  async getAllFeedbacks(): Promise<Feedback[]> {
    const feedbacks = await this.prisma.feedback.findMany();
    if (!feedbacks.length) {
      throw new NotFoundException(`Feedbacks not found.`);
    }
    return feedbacks;
  }

  async getFeedbacksByUserId(userId: number): Promise<Feedback[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: { userId },
    });
    if (!feedbacks.length) {
      throw new NotFoundException(`Feedbacks not found for user.`);
    }
    return feedbacks;
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
