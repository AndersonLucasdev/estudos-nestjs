import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationController } from '../controllers/conversation.controller';
import { ConversationService } from '../services/conversation.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class CommentLikeModule {}
