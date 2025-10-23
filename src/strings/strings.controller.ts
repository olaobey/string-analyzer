import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { QueryStringsDto } from './dto/query-strings.dto';

@ApiTags('strings')
@Controller('strings') // ← no versioning, no prefix
export class StringsController {
  constructor(private readonly service: StringsService) {}

  // 4) NATURAL LANGUAGE FILTER — keep above param route
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
    if (!query || !query.trim()) {
      throw new BadRequestException('Query parameter is required');
    }
    return this.service.filterByNaturalLanguage(query);
  }

  // 1) CREATE
  @Post()
  @ApiCreatedResponse({ description: 'String analyzed and stored' })
  @ApiConflictResponse({ description: 'String already exists in the system' })
  @ApiBadRequestResponse({ description: 'Invalid request body or missing "value" field' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data type for "value" (must be string)' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStringDto) {
    // Do not call a "getOne" pre-check that throws 404; service.create handles 409/400/422
    return this.service.create(dto.value as unknown);
  }

  // 3) LIST + FILTERS
  @Get()
  @ApiOkResponse({ description: 'List of strings with optional filters' })
  @ApiBadRequestResponse({ description: 'Invalid query parameter values or types' })
  async getAll(@Query() q: QueryStringsDto) {
    return this.service.getAll(q as any);
  }

  // 2) GET SPECIFIC
  @Get(':string_value')
  @ApiOkResponse({ description: 'Returns the analyzed string' })
  @ApiNotFoundResponse({ description: 'String does not exist in the system' })
  async getOne(@Param('string_value') value: string) {
    return this.service.getOneByValue(value);
  }

  // 5) DELETE
  @Delete(':string_value')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'String successfully deleted' })
  @ApiNotFoundResponse({ description: 'String does not exist in the system' })
  async delete(@Param('string_value') value: string) {
    await this.service.deleteByValue(value);
  }
}