import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
  } from '@nestjs/common';
  import { PrismaModule } from 'src/prisma/prisma.module';
  import { BlockController } from '../controllers/block.controller'; 
  import { BlockService } from '../services/block.service'; 
  
  @Module({
    imports: [PrismaModule],
    controllers: [BlockController],
    providers: [BlockService],
  })
  export class BlockModule {}