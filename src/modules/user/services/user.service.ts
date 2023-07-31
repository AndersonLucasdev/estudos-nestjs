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

  async GetAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    if (!users || users.length === 0) {
      throw new NotFoundException('Não existem usuários cadastrados.');
    }
    return users;
  }

  async GetUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async GetUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  // Method to get the user with that name
  async GetUserByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }

  // Method to find multiple people with that part of the name
  async GetUsersByUsername(username: string) {
    const user = this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return user;
  }

  // Method to get users with more likes
  async GetUsersWithMostLikes() {
    const usersWithMostLikes = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        postLikes: {
          select: {
            id: true,
          },
          orderBy: {
            id: 'desc', // Ordenar as curtidas em ordem decrescente pelo ID (ou outra propriedade relevante)
          },
          take: 3, // Limitar a quantidade de curtidas retornadas para cada usuário (opcional)
        },
      },
      orderBy: {
        postLikes: {
          _count: 'desc',
        },
      },
    });

    if (!usersWithMostLikes || usersWithMostLikes.length === 0) {
      throw new NotFoundException(
        'Não existem usuários com likes registrados.',
      );
    }

    return usersWithMostLikes;
  }

  //method to get users with latest updates
  async GetUsersWithRecentActivity(days: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        lastUpdateDate: {
          gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
        },
      },
    });
    if (!users) {
      throw new NotFoundException(
        'Não existem usuários com atividade recente.',
      );
    }
    return users;
  }

  async CreateUser(data: CreateUserDto): Promise<User> {
    const { email, username, password, confirmPassword } = data;

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
    const passwordtrimmed = password.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();
    if (passwordtrimmed !== confirmPasswordTrimmed) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const hashedPassword = await bcrypt.hash(passwordtrimmed, 10);

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
      updatedData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return updatedUser;
  }
}
