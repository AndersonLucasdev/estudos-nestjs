import { Controller, Post, HttpCode, HttpStatus, UnauthorizedException, UseGuards, Body } from "@nestjs/common"; // Adicione "Body" ao import
import { AuthService } from "../services/auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";

@Controller('auth') 
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    // @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginData: { username: string, password: string }) {
        const user = await this.authService.validateUser(loginData.username, loginData.password);
        if (!user) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }
        return this.authService.login(user);
    }
}
