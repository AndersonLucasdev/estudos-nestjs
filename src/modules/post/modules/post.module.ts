import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../service/post.service';
import { ValidationUserMiddleware } from 'src/middlewares/validation-user.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationUserMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.PATCH },
      );
  }
}