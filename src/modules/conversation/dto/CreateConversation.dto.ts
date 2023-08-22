import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  participants: number[];
}