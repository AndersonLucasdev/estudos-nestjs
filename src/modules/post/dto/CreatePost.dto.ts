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
  IsBoolean
} from 'class-validator';

export class CreatePostDto {
  @IsInt()
  userId: number;

  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  disableComments: boolean;
}
