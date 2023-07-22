// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OSIsIm5hbWUiOiJMdWNhIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNCwiaWF0IjoxNTE2MjM5MDIyfQ.XsC1wZmh6D_Aq0id05hhI43EaCiLbmgsTnHKVhHuX0E", // Coloque sua chave secreta aqui (pode ser qualquer string)
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }
    return user;
  }
}