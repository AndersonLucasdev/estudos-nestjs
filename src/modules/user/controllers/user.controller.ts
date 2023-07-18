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
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';
import { formatUserData } from 'src/utils/FormartUserData';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new DtoValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const formattedUserData = formatUserData(createUserDto);
      const user = await this.userService.CreateUser(formattedUserData);
      console.log(user);
      return { message: 'Usuário criado com sucesso!', user };
    } catch (error) {
      console.log('Erro ao criar usuário:', error);
      throw new BadRequestException(
        'Erro ao criar usuário. Verifique os dados enviados.',
      );
    }
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
      const user = await this.userService.PatchUser(id, patchUserDto);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      return { message: 'Usuário atualizado com sucesso!', user };
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
