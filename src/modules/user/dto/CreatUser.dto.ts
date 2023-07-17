// import {
//   IsString,
//   IsOptional,
//   IsEmail,
//   IsDate,
//   IsEnum,
//   MinLength,
//   Matches,
//   isString,
// } from 'class-validator';
// import { Gender } from '@prisma/client';

// export class CreateUserDto {
//   @IsString()
//   username: string;

//   @IsString()
//   name: string;

//   @IsString()
//   Bio: string;

//   @IsEmail({}, { message: 'E-mail inválido' })
//   email: string;

//   @IsString()
//   @MinLength(6, {
//     message: 'A senha deve ter pelo menos 6 caracteres',
//   })
//   @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
//     message:
//       'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
//   })
//   password: string;

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

