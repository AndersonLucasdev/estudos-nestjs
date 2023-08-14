import { Module } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebSocketService } from './websocket.service'; 

@Module({
  providers: [WebSocketService],
})
export class WebSocketModule {}