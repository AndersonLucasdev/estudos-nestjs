import { IsString, IsInt} from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';

export class CreateCommentLikeDto {
  @IsInt()
  commentId: number;

  @IsInt()
  userId: number;

}
