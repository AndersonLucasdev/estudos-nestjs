import { IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateTagDto {
  @IsInt()
  taggedUserId: number;

  @IsDate()
  createdAt: Date;

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

}
