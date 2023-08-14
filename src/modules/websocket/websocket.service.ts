import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  private connections: Record<number, string> = {}; 

  addUserConnection(userId: number, connectionId: string): void {
    this.connections[userId] = connectionId;
  }

  removeUserConnection(userId: number): void {
    delete this.connections[userId];
  }

  sendNotificationToUser(userId: number, notification: any): void {
    const connectionId = this.connections[userId];
    if (connectionId) {
      this.server.to(connectionId).emit('notification', notification);
    }
  }
}