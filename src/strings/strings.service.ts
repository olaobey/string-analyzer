import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StringRecord } from './entities/string-record.entity';
import { computeProperties } from './util/compute-properties';
import { StringsRepository, FilterWhere } from './strings.repository';
import { NaturalLanguageParser } from './util/natural-language.parser';

@Injectable()
export class StringsService {
  constructor(
    private readonly repo: StringsRepository,
    @InjectRepository(StringRecord)
    private readonly ormRepo: Repository<StringRecord>,
  ) {}

  private toResponse(record: StringRecord) {
    return {
      id: record.id,
      value: record.value,
      properties: {
        length: record.length,
        is_palindrome: record.is_palindrome,
        unique_characters: record.unique_characters,
        word_count: record.word_count,
        sha256_hash: record.id,
        character_frequency_map: record.character_frequency_map,
      },
      created_at: record.created_at.toISOString(),
    };
  }

  async create(value: unknown) {
    if (typeof value !== 'string') {
      throw new UnprocessableEntityException(
        'Invalid data type for "value" (must be string)',
      );
    }
    if (!value || !value.trim()) {
      throw new BadRequestException('Invalid request body or missing "value" field');
    }

    const props = computeProperties(value);

    // check if exists by value (unique)
    const existing = await this.repo.findByValue(value);
    if (existing) throw new ConflictException('String already exists in the system');

    const rec = this.ormRepo.create({
      id: props.sha256_hash,
      value,
      length: props.length,
      is_palindrome: props.is_palindrome,
      unique_characters: props.unique_characters,
      word_count: props.word_count,
      character_frequency_map: props.character_frequency_map,
    });

    const saved = await this.repo.create(rec);
    return this.toResponse(saved);
  }

  async getOneByValue(rawPathParam: string) {
    // path may be URL-encoded; decode safely
    let value = rawPathParam;
    try {
      value = decodeURIComponent(rawPathParam);
    } catch {
      // keep original if decode fails
    }
    const rec = await this.repo.findByValue(value);
    if (!rec) throw new NotFoundException('String does not exist in the system');
    return this.toResponse(rec);
  }

  async getAll(q: {
    is_palindrome?: string;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
  }) {
    // Validate boolean string
    let isPal: boolean | undefined = undefined;
    if (q.is_palindrome !== undefined) {
      if (!['true', 'false'].includes(q.is_palindrome)) {
        throw new BadRequestException('Invalid query parameter values or types');
      }
      isPal = q.is_palindrome === 'true';
    }
    if (
      (q.min_length !== undefined && q.min_length < 0) ||
      (q.max_length !== undefined && q.max_length < 0) ||
      (q.word_count !== undefined && q.word_count < 0)
    ) {
      throw new BadRequestException('Invalid query parameter values or types');
    }
    if (q.contains_character !== undefined && q.contains_character.length !== 1) {
      throw new BadRequestException('Invalid query parameter values or types');
    }
    if (
      q.min_length !== undefined &&
      q.max_length !== undefined &&
      q.min_length > q.max_length
    ) {
      throw new BadRequestException('Invalid query parameter values or types');
    }

    const filters: FilterWhere = {
      is_palindrome: isPal,
      min_length: q.min_length,
      max_length: q.max_length,
      word_count: q.word_count,
      contains_character: q.contains_character,
    };
    const { data, count } = await this.repo.findAll(filters);
    return {
      data: data.map((d) => this.toResponse(d)),
      count,
      filters_applied: {
        ...(isPal !== undefined ? { is_palindrome: isPal } : {}),
        ...(q.min_length !== undefined ? { min_length: q.min_length } : {}),
        ...(q.max_length !== undefined ? { max_length: q.max_length } : {}),
        ...(q.word_count !== undefined ? { word_count: q.word_count } : {}),
        ...(q.contains_character !== undefined
          ? { contains_character: q.contains_character }
          : {}),
      },
    };
  }

  async filterByNaturalLanguage(query: string) {
    const { parsed, reason } = NaturalLanguageParser.parse(query);
    if (reason && Object.keys(parsed).length === 0) {
      throw new BadRequestException('Unable to parse natural language query');
    }
    if (
      parsed.min_length !== undefined &&
      parsed.max_length !== undefined &&
      parsed.min_length > parsed.max_length
    ) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters',
      );
    }
    const { data, count } = await this.repo.findAll(parsed);
    return {
      data: data.map((d) => this.toResponse(d)),
      count,
      interpreted_query: {
        original: query,
        parsed_filters: parsed,
      },
    };
  }

  async deleteByValue(rawPathParam: string) {
    let value = rawPathParam;
    try {
      value = decodeURIComponent(rawPathParam);
    } catch {}
    const affected = await this.repo.deleteByValue(value);
    if (affected === 0) {
      throw new NotFoundException('String does not exist in the system');
    }
    return; // 204
  }
}
