import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/CreatUser.dto';
import { PatchUserDto } from '../dto/PatchUser.dto';
import * as bcrypt from 'bcrypt';
import { TrimSpaces, CapitalFirstLetter } from 'src/utils/helpers';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async GetUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async GetAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async CreateUser(data: CreateUserDto): Promise<User> {
    try {
      const { email, password } = data;

      // Trim do campo de e-mail
      const trimmedEmail = TrimSpaces(email);

      // Criar um hash da senha antes de salvar no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: { ...data, email: trimmedEmail, password: hashedPassword },
      });

      return user;
    } catch (error) {
      console.log('Erro ao criar usuário:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao criar usuário. Verifique os dados enviados.',
      );
    }
  }

  async DeleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async PatchUser(id: number, data: PatchUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password } = data;

    const updatedData: Partial<PatchUserDto> = {};

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return updatedUser;
  }
}
