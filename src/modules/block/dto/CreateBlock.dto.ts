import { IsInt } from 'class-validator';

export class CreateBlockDto {
  @IsInt()
  blockedUserId: number;

  @IsInt()
  userId: number;
}