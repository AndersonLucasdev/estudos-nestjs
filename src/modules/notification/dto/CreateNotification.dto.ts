import {
  IsString,
  IsInt,
  IsEmail,
  IsDate,
  IsEnum,
  Equals,
  MinLength,
  Matches,
  IsOptional,
  isEmail,
} from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsNotEmptyString()
  message: string;

  @IsDate()
  creationDate: Date;

  @IsInt()
  typeId: number;

  @IsEnum(NotificationType)
  type: NotificationType;
}
