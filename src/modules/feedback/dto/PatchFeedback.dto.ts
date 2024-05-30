import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { IsNotEmptyString } from 'src/decorators/IsNot-Empty-String.decorator';

export class PatchFeedbackDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsNotEmptyString()
  @IsOptional()
  content?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsOptional()
  createdAt?: Date;
}
