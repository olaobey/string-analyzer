import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStringsDto {
  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBooleanString()
  is_palindrome?: string;

  @ApiPropertyOptional({ type: Number, example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_length?: number;

  @ApiPropertyOptional({ type: Number, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_length?: number;

  @ApiPropertyOptional({ type: Number, example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  word_count?: number;

  @ApiPropertyOptional({ type: String, example: 'a', description: 'single character' })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  contains_character?: string;
}
