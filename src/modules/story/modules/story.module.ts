import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoryController } from '../controllers/story.controller';
import { StoryService } from '../services/story.service';

@Module({
  imports: [PrismaModule],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StorynModule {}