import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Realize a validação dos dados de entrada
    const { username, name, email, password, confirmPassword, phone, gender, birthDate, profilePhoto } = req.body;

    if (!username || !name || !email || !password || !confirmPassword) {
      throw new BadRequestException('Campos obrigatórios estão faltando');
    }
    next();
  }
}