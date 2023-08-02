import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/modules/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './commom/filters/exception.filter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PostModule } from './modules/post/modules/post.module';
import { AuthModule } from './modules/auth/modules/auth.module';
import { CommentLikeModule } from './modules/commentlike/modules/comment-like.module';
import { PostLikeModule } from './modules/postlike/modules/post-like.module';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    AuthModule,
    CommentLikeModule,
    PostLikeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
