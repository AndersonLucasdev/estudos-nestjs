import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationController } from '../controllers/notification.controller'; 
import { NotificationService } from '../services/notification.service'; 