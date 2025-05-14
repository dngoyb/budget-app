import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSavingsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsOptional()
  description?: string;
}
