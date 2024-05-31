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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/:userId')
  async getFeedbacksByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Feedback[]> {
    try {
      return await this.feedbackService.getFeedbacksByUserId(userId);
    } catch (error) {
      throw new NotFoundException('Feedbacks not found.');
    }
  }

  @Get('/:id')
  async getFeedbackById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Feedback> {
    try {
      const feedback = await this.feedbackService.getFeedbackById(id);
      if (!feedback) {
        throw new NotFoundException('Feedback not found.');
      }
      return feedback;
    } catch (error) {
      throw new NotFoundException('Feedback not found.');
    }
  }

  @Post('/')
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    try {
      return await this.feedbackService.createFeedback(createFeedbackDto);
    } catch (error) {
      throw new NotFoundException('Failed to create feedback.');
    }
  }

  @Patch('/:id')
  async updateFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchFeedbackDto: PatchFeedbackDto,
  ): Promise<Feedback> {
    try {
      return await this.feedbackService.updateFeedback(id, patchFeedbackDto);
    } catch (error) {
      throw new NotFoundException('Failed to update feedback.');
    }
  }

  @Delete('/:id')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.feedbackService.deleteFeedback(id);
    } catch (error) {
      throw new NotFoundException('Feedback not found.');
    }
  }

  @Get('/')
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      return await this.feedbackService.getAllFeedbacks();
    } catch (error) {
      throw new NotFoundException('Feedbacks not found.');
    }
  }
}
