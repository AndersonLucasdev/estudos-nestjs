import { IsString, IsInt, IsDate, IsOptional, Min, Max } from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';

export class CreateFeedbackDto {
  @IsInt()
  userId: number;

  @IsNotEmptyString()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
