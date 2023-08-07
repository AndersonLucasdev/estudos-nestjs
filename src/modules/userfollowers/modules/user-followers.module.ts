import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserFollowersController } from '../controllers/user-followers.controller';
import { UserFollowersService } from '../services/user-followers.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserFollowersController],
  providers: [UserFollowersService],
})
export class UserFollowersModule {}
