import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DtoValidationPipe());

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const io = new socketIo.Server(server);

  // Implemente lógica para lidar com conexões de clientes
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Exemplo de evento para enviar notificação para um cliente
    socket.on('sendNotification', (notification) => {
      // Lógica para enviar a notificação
      socket.emit('notification', notification);
    });
  });

  await app.listen(3000);
}
bootstrap();