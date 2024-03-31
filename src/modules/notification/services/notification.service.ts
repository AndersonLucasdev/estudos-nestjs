import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from '../dto/CreateNotification.dto';
import { TrimSpaces } from 'src/utils/helpers';
import { Notification } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async getNotificationsByType(
    userId: number,
    type: NotificationType,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId, type },
    });
    return notifications;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = await this.getNotificationById(id);
    if (!notification.read) {
      return this.prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    }
    return notification;
  }

  async countUnreadNotifications(userId: number): Promise<number> {
    const unreadNotifications = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return unreadNotifications;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
    });
    return notifications;
  }

  async getNotificationById(id: number): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notificação com o id ${id} não encontrada.`);
    }
    return notification;
  }

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.create({
        data: createNotificationDto,
      });
      return notification;
    } catch (error) {
      throw new ConflictException('Erro ao criar notificação.');
    }
  }

  async updateNotification(
    id: number,
    updateNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.update({
        where: { id },
        data: updateNotificationDto,
      });
      return notification;
    } catch (error) {
      throw new NotFoundException(`Notificação com o id ${id} não encontrada.`);
    }
  }

  async deleteNotification(id: number): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notificação com o id ${id} não encontrada.`);
    }
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}
