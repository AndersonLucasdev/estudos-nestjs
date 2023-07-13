import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.CreateUser(createUserDto);
    return { message: 'Usuário criado com sucesso!', user };
  }

  @Get()
  async getAllUsers() {
    try {
        const user = await this.userService.getAllUsers();
        return { user }
    } catch (error) {
        throw new NotFoundException('Não existem usuários.');
      }
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    try {
      const user = await this.userService.GetUserById(id);
      return { user };
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  @Patch(':id')
  async patchUser(
    @Param('id') id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    try {
      const user = await this.userService.PatchUser(id, patchUserDto);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return { message: 'Usuário atualizado com sucesso!', user };
    } catch (error) {
      return { error: 'Erro ao atualizar usuário: ' + error.message };
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      const user = await this.userService.DeleteUser(id);
      return { message: 'Usuário removido com sucesso!', user };
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
