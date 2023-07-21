import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../service/post.service';
import { ValidationUserMiddleware } from 'src/middlewares/validation-user.middleware';
import { ValidationPostMiddleware } from 'src/middlewares/validation-post.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationPostMiddleware)
      .forRoutes(
        { path: 'posts', method: RequestMethod.POST },
        { path: 'posts', method: RequestMethod.PATCH },
      );
  }
}