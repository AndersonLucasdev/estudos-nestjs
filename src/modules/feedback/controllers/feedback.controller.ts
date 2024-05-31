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
  @ApiOperation({ summary: 'Get feedbacks by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns feedbacks for the specified user',
  })
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
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the feedback with the specified ID',
  })
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
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created feedback',
  })
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
  @ApiOperation({ summary: 'Update feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: Number })
  @ApiBody({ type: PatchFeedbackDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated feedback',
  })
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
  @ApiOperation({ summary: 'Delete feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: Number })
  @ApiResponse({
    status: 204,
    description: 'Feedback successfully deleted',
  })
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
