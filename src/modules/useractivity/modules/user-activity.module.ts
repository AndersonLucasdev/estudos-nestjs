import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserActivityController } from '../controllers/user-activity.controller'; 
import { UserActivityService } from '../services/user-activity.service'; 

@Module({
  imports: [PrismaModule],
  controllers: [UserActivityController],
  providers: [UserActivityService],
})
export class UserActivityModule {}

