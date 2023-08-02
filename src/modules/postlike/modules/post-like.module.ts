import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostLikeController } from '../controllers/post-like.controller';
import { PostLikeService } from '../services/post-like.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostLikeController],
  providers: [PostLikeService],
})
export class PostLikeModule {}
