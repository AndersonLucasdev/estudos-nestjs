import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service'; 

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class TagnModule {}