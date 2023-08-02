import { IsInt} from 'class-validator';

export class CreatePostLikeDto {
  @IsInt()
  postId: number;

  @IsInt()
  userId: number;
}
