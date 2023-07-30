import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentController } from '../controllers/comment.controller';
import { CommentService } from '../services/comment.service';
import { ValidationCommentMiddleware } from 'src/middlewares/validation-comment.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationCommentMiddleware)
      .forRoutes(
        { path: 'comments', method: RequestMethod.POST },
        { path: 'comments', method: RequestMethod.PATCH },
      );
  }
}