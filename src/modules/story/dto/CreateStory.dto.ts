import {
  IsString,
  IsInt,
  IsEmail,
  IsDate,
  IsEnum,
  Equals,
  IsBoolean,
  MinLength,
  Matches,
  IsOptional,
  isEmail,
} from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';
import { NotificationType } from '@prisma/client';

export class CreateStoryDto {

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsDate()
  creationDate: Date;

  @IsInt()
  viewCount: number;


  @IsBoolean()
  @IsOptional()
  disableComments?: boolean;

  // @IsOptional()
  // @IsInt({ each: true })
  // replies?: number[];
}