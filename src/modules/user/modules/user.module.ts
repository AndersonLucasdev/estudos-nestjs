import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { ValidationUserMiddleware } from 'src/middlewares/validation-user.middleware';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { WebSocketModule } from 'src/modules/websocket/websocket.module';

@Module({
  imports: [PrismaModule, WebSocketModule], 
  controllers: [UserController],
  providers: [UserService, WebSocketService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationUserMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.PATCH },
      );
  }
}