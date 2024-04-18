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

export class PatchStoryDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  disableComments?: boolean;
}
