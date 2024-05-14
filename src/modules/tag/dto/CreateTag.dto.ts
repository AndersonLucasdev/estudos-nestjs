import { IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateTagDto {

  @IsInt()
  taggedUserId: number;

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

  @IsDate()
  createdAt: Date;
}