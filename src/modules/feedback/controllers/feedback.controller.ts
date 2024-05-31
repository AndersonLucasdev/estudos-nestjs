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
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
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
}
