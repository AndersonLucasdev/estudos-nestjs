import {
  IsString,
  IsEmail,
  IsDate,
  IsEnum,
  MinLength,
  Matches,
  IsOptional,
  isEmail,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class PatchPostDto {
  @IsInt()
  userId: number;

  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  disableComments: boolean;

  @IsInt()
  likes: number;
}
