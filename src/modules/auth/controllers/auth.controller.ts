import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Body,
} from '@nestjs/common'; // Adicione "Body" ao import
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid username or password' })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
  async login(@Body() loginData: { username: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        loginData.username,
        loginData.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid username or password');
      }
      throw error;
    }
  }
}
