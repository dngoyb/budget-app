import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number) // Ensure the value is transformed to a number
  amount!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string | Date; // Accepts both string and Date types
  // Note: The userId will typically be obtained from the authenticated user
  // in the controller or service, not directly from the request body.
}
