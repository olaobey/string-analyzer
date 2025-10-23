// src/strings/strings.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StringsRepository } from './strings.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StringRecord } from './entities/string-record.entity';
import { computeProperties } from './util/compute-properties';
import { NaturalLanguageParser } from './util/natural-language.parser';

type PublicString = {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };
  created_at: string;
};

const INT32_MAX = 2147483647;

@Injectable()
export class StringsService {
  constructor(
    private readonly repo: StringsRepository,
    @InjectRepository(StringRecord)
    private readonly ormRepo: Repository<StringRecord>,
  ) {}

  private toResponse(rec: StringRecord): PublicString {
    return {
      id: rec.id,
      value: rec.value,
      properties: {
        length: rec.length,
        is_palindrome: rec.is_palindrome,
        unique_characters: rec.unique_characters,
        word_count: rec.word_count,
        sha256_hash: rec.id,
        character_frequency_map: rec.character_frequency_map as any,
      },
      created_at: rec.created_at.toISOString(),
    };
  }

  async create(value: unknown) {
    if (typeof value !== 'string') {
      throw new UnprocessableEntityException('Invalid data type for "value" (must be string)');
    }
    if (!value || !value.trim()) {
      throw new BadRequestException('Invalid request body or missing "value" field');
    }
    const existing = await this.repo.findByValue(value);
    if (existing) {
      throw new ConflictException('String already exists in the system');
    }
    const props = computeProperties(value);
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

  async getOneByValue(raw: string) {
    let value = raw;
    try { value = decodeURIComponent(raw); } catch {}
    const rec = await this.repo.findByValue(value);
    if (!rec) throw new NotFoundException('String does not exist in the system');
    return this.toResponse(rec);
  }

  async getAll(filters: {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
  }) {
    const { data, count } = await this.repo.findAll(filters);
    return { data: data.map(this.toResponse), count, filters_applied: filters };
  }

  /** strip bogus/huge values, normalize ints, and drop out-of-range max */
  private sanitizeFilters(parsed: any) {
    const out: any = { ...parsed };

    if (typeof out.min_length === 'number') {
      out.min_length = Math.max(0, Math.floor(out.min_length));
    } else {
      delete out.min_length;
    }

    if (typeof out.max_length === 'number') {
      out.max_length = Math.max(0, Math.floor(out.max_length));
      if (out.max_length > INT32_MAX) {
        // Drop giant sentinels like Number.MAX_SAFE_INTEGER
        delete out.max_length;
      }
    } else {
      delete out.max_length;
    }

    if (
      typeof out.min_length === 'number' &&
      typeof out.max_length === 'number' &&
      out.min_length > out.max_length
    ) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters',
      );
    }
    return out;
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

    const safe = this.sanitizeFilters(parsed);

    // DEBUG once: confirm no huge max gets through
    // console.log('NL parsed:', parsed, 'sanitized:', safe);

    const { data, count } = await this.repo.findAll(safe);
    return {
      data: data.map((d) => this.toResponse(d)),
      count,
      interpreted_query: { original: query, parsed_filters: safe },
    };
  }

  async deleteByValue(value: string) {
    const affected = await this.repo.deleteByValue(value);
    if (!affected) throw new NotFoundException('String does not exist in the system');
  }
}
