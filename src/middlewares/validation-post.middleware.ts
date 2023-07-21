import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationPostMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Realize a validação dos dados de entrada
    const { image, description, disableComments } = req.body;

    
    next();
  }
}