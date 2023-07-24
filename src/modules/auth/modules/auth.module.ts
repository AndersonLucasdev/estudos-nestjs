import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/local.strategy';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from 'src/modules/user/services/user.service';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [UserController, AuthController],
  exports: [AuthService],
})
export class AuthModule {}