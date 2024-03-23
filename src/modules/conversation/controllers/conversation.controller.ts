import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Query,
    Body,
    Param,
    ParseIntPipe,
    UsePipes,
    NotFoundException,
    HttpStatus,
    ConflictException,
    BadRequestException,
    HttpException,
  } from '@nestjs/common';

// @Get(':userId/conversations')
//   async getUserConversations(@Param('userId') userId: number): Promise<Conversation[]> {
//     return this.messageService.getUserConversations(userId);
//   }

//   @Get(':userId/recent-conversations')
//   async getRecentConversations(@Param('userId') userId: number): Promise<Conversation[]> {
//     return this.messageService.getRecentConversations(userId);
//   }