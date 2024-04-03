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
import { NotificationType } from '@prisma/client';
import { UserActivityType } from '@prisma/client';

export class PatchUserActivityDto {
  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(UserActivityType)
  activityType: UserActivityType;

  @IsOptional()
  @IsInt()
  entityId: number;

  @IsOptional()
  @IsDate()
  creationDate: Date;

  @IsOptional()
  @IsEnum(NotificationType)
  notificationType: NotificationType;
}
