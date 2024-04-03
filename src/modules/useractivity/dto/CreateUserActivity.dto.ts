import { ApiProperty } from '@nestjs/swagger';
import { UserActivityType } from '../enums/user-activity-type.enum';
import {
    IsString,
    IsEmail,
    IsDate,
    IsEnum,
    Equals,
    MinLength,
    Matches,
    IsOptional,
    isEmail,
  } from 'class-validator';
  import { Gender } from '@prisma/client';
 


export class UserActivityDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  activityType: UserActivityType;

  @ApiProperty()
  entityId: number;
}