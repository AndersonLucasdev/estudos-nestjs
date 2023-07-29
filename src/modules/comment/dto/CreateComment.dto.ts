import { IsString, IsInt} from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  PostId: number;

  @IsInt()
  userId: number;

  @IsString()
  content: string;
}
