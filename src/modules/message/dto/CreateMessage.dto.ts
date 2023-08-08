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

export class CreateMessageDto {
  @IsInt()
  senderId: number;

  @IsInt()
  recipientId: number;

  @IsNotEmptyString()
  content: string;

  @IsDate()
  creationDate: Date;
}
