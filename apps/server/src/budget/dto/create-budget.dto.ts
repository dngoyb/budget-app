import { IsNumber, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number) // Ensure the value is transformed to a number
  amount!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number) // Ensure the value is transformed to an integer
  month!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Type(() => Number) // Ensure the value is transformed to an integer
  year!: number;
}
