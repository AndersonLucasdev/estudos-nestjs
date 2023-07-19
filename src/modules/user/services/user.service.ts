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
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async GetUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async GetUserByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }

  async GetUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async GetAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    if (!users || users.length === 0) {
      throw new NotFoundException('Não existem usuários cadastrados.');
    }
    return users;
  }

  async CreateUser(data: CreateUserDto): Promise<User> {
    const { email, username, password } = data;

    // Trim do campo de e-mail e do username
    const trimmedEmail = TrimSpaces(email);
    const trimmedUsername = TrimSpaces(username);

    // Verificar se o email já está em uso
    const existingUserEmail = await this.prisma.user.findFirst({
      where: { email: trimmedEmail },
    });
    if (existingUserEmail) {
      throw new ConflictException('O e-mail já está em uso.');
    }

    // Verificar se o username já está em uso
    const existingUserName = await this.prisma.user.findFirst({
      where: { username: trimmedUsername },
    });
    if (existingUserName) {
      throw new ConflictException('O username já está em uso.');
    }

    // Criar um hash da senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        email: trimmedEmail,
        username: trimmedUsername,
        password: hashedPassword,
      },
    });

    return user;
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
