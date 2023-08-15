import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly connections: Record<number, string> = {};

  handleConnection(client: Socket) {
    const userId = this.getUserIdFromClient(client); 
    this.connections[userId] = client.id;
    console.log(`Usuário ${userId} conectado`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromClient(client);
    delete this.connections[userId];
    console.log(`Usuário ${userId} desconectado`);
  }

  private getUserIdFromClient(client: Socket): number | null {
    const userId = client.handshake.query.userId;
  
    if (!userId) {
      console.error('ID do usuário não fornecida no cliente');
      return null;
    }
  
    if (Array.isArray(userId)) {
      console.error('ID do usuário é um array, mas espera-se uma string');
      return null;
    }
  
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      console.error('ID do usuário fornecida não é um número válido');
      return null;
    }
  
    return parsedUserId;
  }

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
