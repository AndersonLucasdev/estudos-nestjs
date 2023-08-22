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
  
  export class PatchNotificationDto {
    @IsOptional()
    @IsInt()
    userId: number;
  
    @IsOptional()
    @IsNotEmptyString()
    message: string;
  
    @IsOptional()
    @IsDate()
    creationDate: Date;
  
    @IsOptional()
    @IsInt()
    typeId: number;
  
    @IsOptional()
    @IsEnum(NotificationType)
    type: NotificationType;
  }