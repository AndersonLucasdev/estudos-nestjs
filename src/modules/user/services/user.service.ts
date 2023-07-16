import {
  Injectable,
  NotFoundException,
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
    const { username, name, email, password, phone, profilePhoto } = data;

    const trimmedUsername = TrimSpaces(username);
    const capitalizedName = CapitalFirstLetter(name.trim());
    const trimmedEmail = TrimSpaces(email);
    const trimmedPassword = TrimSpaces(password);
    const trimmedPhone = phone ? TrimSpaces(phone) : undefined;
    const trimmedProfilePhoto = profilePhoto ? TrimSpaces(profilePhoto) : undefined;

    const existingUserEmail = await this.prisma.user.findFirst({
      where: { email: trimmedEmail },
    });
    const existingUserName = await this.prisma.user.findFirst({
      where: { username: trimmedUsername },
    });
    if (existingUserEmail) {
      throw new ConflictException('O e-mail já está em uso.');
    }

    if (existingUserName) {
      throw new ConflictException('O username já está em uso.');
    }

    // Criar um hash da senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        username: trimmedUsername,
        name: capitalizedName,
        email: trimmedEmail,
        password: hashedPassword,
        phone: trimmedPhone,
        profilePhoto: trimmedProfilePhoto,
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

    const { email, username, password, name, phone, profilePhoto } = data;

    if (email && email !== existingUser.email) {
      const userWithEmail = await this.prisma.user.findFirst({ where: { email } });

      if (userWithEmail) {
        throw new ConflictException('O e-mail já está em uso');
      }
    }

    if (username && username !== existingUser.username) {
      const userWithUsername = await this.prisma.user.findFirst({ where: { username } });

      if (userWithUsername) {
        throw new ConflictException('O nome de usuário já está em uso');
      }
    }

    const updatedData: Partial<PatchUserDto> = {};

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (name) {
      updatedData.name = CapitalFirstLetter(TrimSpaces(name));
    }

    if (phone) {
      updatedData.phone = TrimSpaces(phone);
    }

    if (profilePhoto) {
      updatedData.profilePhoto = TrimSpaces(profilePhoto);
    }

    const updatedUser = await this.prisma.user.update({ where: { id }, data: updatedData });

    return updatedUser;
  }
}
