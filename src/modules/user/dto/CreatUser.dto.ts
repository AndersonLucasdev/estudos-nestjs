import {
  IsString,
  IsEmail,
  IsDate,
  IsEnum,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { TrimSpacesDecorator } from 'src/decorators/trim-spaces.decorator';
import { CapitalFirstLetterDecorator } from 'src/decorators/capital-first-letter.decorator';

export class CreateUserDto {
  @IsString()
  //@TrimSpacesDecorator()
  username: string;

  @IsString()
  //@CapitalFirstLetterDecorator()
  name: string;

  @IsString()
  //@TrimSpacesDecorator()
  @IsOptional()
  Bio?: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsString()
  //@TrimSpacesDecorator()
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password: string;

  @IsString()
  //@TrimSpacesDecorator()
  @IsOptional()
  phone?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  //@TrimSpacesDecorator()
  @IsOptional()
  profilePhoto?: string;

  @IsDate()
  //@TrimSpacesDecorator()
  @IsOptional()
  creationDate?: Date;

  @IsString()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
