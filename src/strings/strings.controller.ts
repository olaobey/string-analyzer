import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
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
  async create(@Body() dto: CreateStringDto) {
    return this.service.create(dto.value);
  }

  @Get(':string_value')
  @ApiOkResponse({ description: 'Returns the analyzed string' })
  async getOne(@Param('string_value') value: string) {
    return this.service.getOneByValue(value);
  }

  @Get()
  @ApiOkResponse({ description: 'List of strings with optional filters' })
  @ApiBadRequestResponse({ description: 'Invalid query parameter values or types' })
  async getAll(@Query() q: QueryStringsDto) {
    return this.service.getAll(q as any);
  }

  @Get('filter-by-natural-language/query')
  @ApiOkResponse({ description: 'Natural language filtered results' })
  @ApiBadRequestResponse({ description: 'Unable to parse natural language query' })
  @ApiUnprocessableEntityResponse({ description: 'Query parsed but resulted in conflicting filters' })
  async filterByNaturalLanguageViaQuery(@Query('query') query: string) {
    return this.service.filterByNaturalLanguage(query);
  }


  @Delete(':string_value')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'String successfully deleted' })
  @ApiNotFoundResponse({ description: 'String does not exist in the system' })
  async delete(@Param('string_value') value: string) {
    await this.service.deleteByValue(value);
  }
}
