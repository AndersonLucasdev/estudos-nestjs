import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackDto } from '../dto/CreateFeedback.dto';
import { PatchFeedbackDto } from '../dto/PatchFeedback.dto';
import { Feedback } from '@prisma/client';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/:userId')
  async getFeedbacksByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Feedback[]> {
    return await this.feedbackService.getFeedbacksByUserId(userId);
  }

  @Post('/')
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return await this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Patch('/:id')
  async updateFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchFeedbackDto: PatchFeedbackDto,
  ): Promise<Feedback> {
    return await this.feedbackService.updateFeedback(id, patchFeedbackDto);
  }

  @Delete('/:id')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.feedbackService.deleteFeedback(id);
  }
}
