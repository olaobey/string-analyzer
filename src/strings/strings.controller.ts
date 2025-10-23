import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { QueryStringsDto } from './dto/query-strings.dto';

@ApiTags('strings')
@Controller({ path: 'strings', version: '1' })
export class StringsController {
  constructor(private readonly service: StringsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'String analyzed and stored' })
  @ApiConflictResponse({ description: 'String already exists in the system' })
  @ApiBadRequestResponse({ description: 'Invalid request body or missing "value" field' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data type for "value" (must be string)' })
  @HttpCode(HttpStatus.CREATED) // make the 201 explicit
  async create(@Body() dto: CreateStringDto) {
    // Validate input type & presence
    if (dto?.value === undefined || dto?.value === null) {
      throw new BadRequestException('Invalid request body or missing "value" field');
    }
    if (typeof dto.value !== 'string') {
      throw new UnprocessableEntityException('Invalid data type for "value" (must be string)');
    }
    const value = dto.value.trim();
    if (!value) {
      throw new BadRequestException('Invalid request body or missing "value" field');
    }

    const created = await this.service.create(value);
    return created; 
  }

@Get('filter-by-natural-language')
@ApiOkResponse({ description: 'Natural language filtered results' })
@ApiBadRequestResponse({ description: 'Unable to parse natural language query' })
@ApiUnprocessableEntityResponse({ description: 'Query parsed but resulted in conflicting filters' })
@ApiQuery({
  name: 'query',
  required: true,
  type: String,
  examples: {
    singleWordPalindromes: {
      summary: 'All single-word palindromic strings',
      value: 'all single word palindromic strings',
    },
    longerThan10: {
      summary: 'Strings longer than 10 characters',
      value: 'strings longer than 10 characters',
    },
    containsZ: {
      summary: 'Strings containing the letter z',
      value: 'strings containing the letter z',
    },
  },
})
async filterByNaturalLanguage(@Query('query') query: string) {
  return this.service.filterByNaturalLanguage(query);
}

  @Get(':string_value')
  @ApiOkResponse({ description: 'Returns the analyzed string' })
  @ApiNotFoundResponse({ description: 'String does not exist in the system' })
  async getOne(@Param('string_value') value: string) {
    const res = await this.service.getOneByValue(value);
    return res;
  }

  @Get()
  @ApiOkResponse({ description: 'List of strings with optional filters' })
  @ApiBadRequestResponse({ description: 'Invalid query parameter values or types' })
  async getAll(@Query() q: QueryStringsDto) {
    return this.service.getAll(q as any);
  }

  @Delete(':string_value')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'String successfully deleted' })
  @ApiNotFoundResponse({ description: 'String does not exist in the system' })
  async delete(@Param('string_value') value: string) {
    await this.service.deleteByValue(value);
  }
}
