import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NaturalLanguageFilterDto {
  @ApiProperty({
    example: 'all single word palindromic strings',
    description: 'free text query for filters',
  })
  @IsString()
  @IsNotEmpty()
  query!: string;
}
