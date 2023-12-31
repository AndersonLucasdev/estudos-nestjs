import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
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
import { UserFollowersModule } from './modules/userfollowers/modules/user-followers.module';
import { MessageModule } from './modules/message/modules/message.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    AuthModule,
    CommentLikeModule,
    PostLikeModule,
    UserFollowersModule,
    MessageModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
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
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('API Bubble')
      .setDescription('API of a social network')
      .setVersion('1.0')
      .addTag('API')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    consumer.apply().forRoutes({ path: 'api', method: RequestMethod.ALL });
  }
}
