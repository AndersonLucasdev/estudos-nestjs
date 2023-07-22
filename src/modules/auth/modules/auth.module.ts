import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OSIsIm5hbWUiOiJMdWNhIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNCwiaWF0IjoxNTE2MjM5MDIyfQ.XsC1wZmh6D_Aq0id05hhI43EaCiLbmgsTnHKVhHuX0E", // Coloque sua chave secreta aqui (a mesma usada na estratégia JWT)
      signOptions: { expiresIn: '24h' }, // Defina o tempo de expiração do token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}