import { IsArray, IsOptional, IsString, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  participants: number[];

  @IsOptional()
  @IsString()
  groupName?: string;
}