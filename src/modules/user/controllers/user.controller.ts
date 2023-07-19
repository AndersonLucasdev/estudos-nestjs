// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Body,
//   Param,
//   ParseIntPipe,
//   UsePipes,
//   NotFoundException,
// } from '@nestjs/common';
// import { UserService } from '../services/user.service';
// import { CreateUserDto } from '../dto/CreatUser.dto';
// import { PatchUserDto } from '../dto/PatchUser.dto';
// import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   @UsePipes(new DtoValidationPipe())
//   async createUser(@Body() createUserDto: CreateUserDto) {
//     const user = await this.userService.CreateUser(createUserDto);
//     return { message: 'Usuário criado com sucesso!', user };
//   }

//   @Get()
//   async getAllUsers() {
//     try {
//       const user = await this.userService.GetAllUsers();
//       return { user };
//     } catch (error) {
//       throw new NotFoundException('Não existem usuários.');
//     }
//   }

//   @Get(':id')
//   async getUserById(@Param('id', ParseIntPipe) id: number) {
//     const user = await this.userService.GetUserById(id);
//     if (!user) {
//       throw new NotFoundException('Usuário não encontrado.');
//     }
//     return { user };
//   }

//   @Patch(':id')
//   async patchUser(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() patchUserDto: PatchUserDto,
//   ) {
//     try {
//       const user = await this.userService.PatchUser(id, patchUserDto);
//       if (!user) {
//         throw new NotFoundException('Usuário não encontrado.');
//       }

//       return { message: 'Usuário atualizado com sucesso!', user };
//     } catch (error) {
//       return { error: 'Erro ao atualizar usuário. ' + error.message };
//     }
//   }

//   @Delete(':id')
//   async deleteUser(@Param('id', ParseIntPipe) id: number) {
//     const user = await this.userService.DeleteUser(id);
//     return { message: 'Usuário removido com sucesso!', user };
//   }
// }

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { formatUserData } from 'src/utils/FormartUserData';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new DtoValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    
      const formattedUserData = formatUserData(createUserDto);
      const user = await this.userService.CreateUser(formattedUserData);
      return { message: 'Usuário criado com sucesso!', user };
    
  }

  @Get()
  async getAllUsers() {
    try {
      const user = await this.userService.GetAllUsers();
      return { user };
    } catch (error) {
      throw new NotFoundException('Não existem usuários.');
    }
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.GetUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return { user };
  }

  @Patch(':id')
  @UsePipes(new DtoValidationPipe())
  async patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    try {
      const existingUser = await this.userService.GetUserById(id);

      if (!existingUser) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Verificar se o e-mail já está em uso
      if (patchUserDto.email) {
        const trimmedEmail = patchUserDto.email.trim();
        const existingUserEmail = await this.userService.GetUserByEmail(trimmedEmail);

        // Se o e-mail já está em uso e pertence a outro usuário, lançamos uma exceção de conflito
        if (existingUserEmail && existingUserEmail.id !== id) {
          throw new ConflictException('O e-mail já está em uso.');
        }
      }

      // Verificar se o username já está em uso
      if (patchUserDto.username) {
        const trimmedUsername = patchUserDto.username.trim();
        const existingUserName = await this.userService.GetUserByUsername(trimmedUsername);

        // Se o username já está em uso e pertence a outro usuário, lançamos uma exceção de conflito
        if (existingUserName && existingUserName.id !== id) {
          throw new ConflictException('O username já está em uso.');
        }
      }

      // Criar um hash da senha antes de salvar no banco de dados
      if (patchUserDto.password) {
        patchUserDto.password = await bcrypt.hash(patchUserDto.password, 10);
      }

      const updatedUser = await this.userService.PatchUser(id, patchUserDto);

      return { message: 'Usuário atualizado com sucesso!', user: updatedUser };
    } catch (error) {
      return { error: 'Erro ao atualizar usuário. ' + error.message };
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.DeleteUser(id);
    return { message: 'Usuário removido com sucesso!', user };
  }
}
