import { IsString, IsOptional, IsEmail, IsDate, IsEnum, Matches } from 'class-validator';
import { Gender } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { CapitalFirstLetter } from 'src/utils/helpers';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
    message: 'A senha deve ter pelo menos 8 caracteres e conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsDate()
  @IsOptional()
  creationDate?: Date;

  @IsString()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
  
  constructor(partial: Partial<PatchUserDto>) {
    Object.assign(this, partial);
  }

  trimAndCapitalizeFields() {
    this.username = TrimSpaces(this.username);
    this.name = CapitalFirstLetter(this.name);
    this.email = TrimSpaces(this.email);
    this.password = TrimSpaces(this.password)
    this.phone = TrimSpaces(this.phone)
    this.profilePhoto = TrimSpaces(this.profilePhoto)
  }
}

