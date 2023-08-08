import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';

@Module({
  imports: [PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
