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
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  disableComments: boolean;
}
