import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
//   import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { TrimSpaces } from 'src/utils/helpers';
import { Notification } from '@prisma/client';
import { WebSocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebSocketService,
  ) {}
}
