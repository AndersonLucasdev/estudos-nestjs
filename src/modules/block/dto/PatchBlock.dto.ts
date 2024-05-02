import { IsOptional, IsInt } from 'class-validator';

export class PatchBlockDto {
  @IsInt()
  @IsOptional()
  blockedUserId?: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}