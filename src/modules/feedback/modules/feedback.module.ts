import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
  } from '@nestjs/common';
  import { PrismaModule } from 'src/prisma/prisma.module';
  import { FeedbackController } from '../controllers/feedback.controller'; 
  import { FeedbackService } from '../services/feedback.service';
  
  @Module({
    imports: [PrismaModule],
    controllers: [FeedbackController],
    providers: [FeedbackService],
  })
  export class NotificationModule {}
  