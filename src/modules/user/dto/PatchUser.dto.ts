import {
  IsString,
  IsEmail,
  Matches,
  Equals,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { IsEmailCustomDecorator } from 'src/decorators/Is-Email-Custom.decorator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  Bio?: string;

  @IsEmailCustomDecorator()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  confirmPassword: string;

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
}
