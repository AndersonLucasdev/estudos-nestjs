import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentLikeController } from '../controllers/comment-like.controller';
import { CommentLikeService } from '../services/comment-like.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentLikeController],
  providers: [CommentLikeService],
})
export class CommentLikeModule {}
