// import {
//   IsString,
//   IsOptional,
//   IsEmail,
//   IsDate,
//   IsEnum,
//   MinLength,
//   Matches,
// } from 'class-validator';
// import { Gender } from '@prisma/client';

// export class PatchUserDto {
//   @IsString()
//   @IsOptional()
//   username?: string;

//   @IsString()
//   @IsOptional()
//   name?: string;

//   @IsString()
//   @IsOptional()
//   Bio?: string;

//   @IsEmail({}, { message: 'E-mail inválido' })
//   @IsOptional()
//   email?: string;

//   @IsString()
//   @MinLength(6, {
//     message: 'A senha deve ter pelo menos 6 caracteres',
//   })
//   @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
//     message:
//       'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
//   })
//   @IsOptional()
//   password?: string;

//   @IsString()
//   @IsOptional()
//   phone?: string;

//   @IsDate()
//   @IsOptional()
//   birthDate?: Date;

//   @IsString()
//   @IsOptional()
//   profilePhoto?: string;

//   @IsDate()
//   @IsOptional()
//   creationDate?: Date;

//   @IsString()
//   @IsOptional()
//   @IsEnum(Gender)
//   gender?: Gender;
// }

import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { TrimSpacesDecorator } from 'src/decorators/trim-spaces.decorator';
import { CapitalFirstLetterDecorator } from 'src/decorators/capital-first-letter.decorator';

export class PatchUserDto {
  @IsString()
  @TrimSpacesDecorator()
  @IsOptional()
  username?: string;

  @IsString()
  @CapitalFirstLetterDecorator()
  @IsOptional()
  name?: string;

  @IsString()
  @TrimSpacesDecorator()
  @IsOptional()
  Bio?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @TrimSpacesDecorator()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres',
  })
  @Matches(/^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&]).$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  @TrimSpacesDecorator()
  @IsOptional()
  password?: string;

  @IsString()
  @TrimSpacesDecorator()
  @IsOptional()
  phone?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @TrimSpacesDecorator()
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
