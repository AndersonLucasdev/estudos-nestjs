import { IsString, IsInt} from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';

export class CreateCommentDto {
  @IsInt()
  PostId: number;

  @IsInt()
  userId: number;

  @IsNotEmptyString()
  content: string;
}
