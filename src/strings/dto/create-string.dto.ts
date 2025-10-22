import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStringDto {
  @ApiProperty({ example: 'string to analyze' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
