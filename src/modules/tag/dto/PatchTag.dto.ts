import { IsInt, IsOptional, IsDate } from 'class-validator';

export class PatchTagDto {
  @IsOptional()
  @IsInt()
  taggedUserId: number;

  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsInt()
  commentId?: number;

  @IsOptional()
  @IsInt()
  storyId?: number;

  @IsOptional()
  @IsDate()
  createdAt: Date;
}
