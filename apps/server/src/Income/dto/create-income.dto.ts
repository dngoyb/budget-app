import {
  IsNumber,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  source!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Type(() => Number)
  year!: number;
}
