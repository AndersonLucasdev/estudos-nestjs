import { IsString, IsOptional, IsInt } from 'class-validator';

export class PatchCommentDto {
  @IsInt()
  PostId: number;

  @IsInt()
  userId: number;

  @IsString()
  @IsOptional()
  content: string;

}
