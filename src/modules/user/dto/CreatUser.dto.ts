import { IsString, IsOptional, IsEmail, IsDate, IsEnum, Matches } from 'class-validator';
import { Gender } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { CapitalFirstLetter } from 'src/utils/helpers';


export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
    message: 'A senha deve ter pelo menos 8 caracteres e conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  password: string;

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

  constructor(partial: Partial<CreateUserDto>) {
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



