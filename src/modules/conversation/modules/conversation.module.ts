import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ConversationService } from '../services/conversation.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentLikeController],
  providers: [ConversationService],
})
export class CommentLikeModule {}
