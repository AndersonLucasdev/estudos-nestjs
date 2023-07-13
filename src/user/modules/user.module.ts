import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { ValidationUserMiddleware } from 'src/middlewares/validation-user.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(ValidationUserMiddleware).forRoutes('users');
    }
  }