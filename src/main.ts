import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';
import { ApolloServer } from 'apollo-server-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { join } from 'path'; // Importe join para construir caminhos
import { GraphQLSchemaHost } from '@nestjs/graphql'; // Importe o GraphQLSchemaHost

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DtoValidationPipe());

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const io = new socketIo.Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('sendNotification', (notification) => {
      socket.emit('notification', notification);
    });
  });

  await app.listen(3000);

  const schemaHost = app.get(GraphQLSchemaHost);
  const apolloServer = new ApolloServer({
    schema: schemaHost.schema,
    context: ({ req }) => ({ req }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app.getHttpAdapter().getInstance(),
    path: '/graphql',
  });

  SubscriptionServer.create(
    { execute, subscribe, schema: schemaHost.schema },
    { server, path: '/subscriptions' }
  );
}
bootstrap();
