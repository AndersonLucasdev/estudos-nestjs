import { IsInt, IsEnum, IsDate } from 'class-validator';
import { UserActivityType } from '@prisma/client';
import { NotificationType } from '@prisma/client';

export class CreateUserActivityDto {
  @IsInt()
  userId: number;

  @IsEnum(UserActivityType)
  activityType: UserActivityType;

  @IsInt()
  entityId: number;

  @IsDate()
  creationDate: Date;

  @IsEnum(NotificationType)
  notificationType: NotificationType;
}