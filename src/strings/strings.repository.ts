import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { StringRecord } from './entities/string-record.entity';

export type FilterWhere = {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
};

@Injectable()
export class StringsRepository {
  constructor(
    @InjectRepository(StringRecord)
    private readonly repo: Repository<StringRecord>,
  ) {}

  async create(record: StringRecord): Promise<StringRecord> {
    return this.repo.save(record);
  }

  async findByValue(value: string): Promise<StringRecord | null> {
    return this.repo.findOne({ where: { value } });
  }

  async findById(id: string): Promise<StringRecord | null> {
    return this.repo.findOne({ where: { id } });
  }

  async deleteByValue(value: string): Promise<number> {
    const res = await this.repo.delete({ value });
    return res.affected ?? 0;
  }

  async findAll(filters: FilterWhere): Promise<{ data: StringRecord[]; count: number }> {
    const where: FindOptionsWhere<StringRecord> = {};

    if (typeof filters.is_palindrome === 'boolean') {
      where.is_palindrome = filters.is_palindrome;
    }
    if (typeof filters.word_count === 'number') {
      where.word_count = filters.word_count;
    }
    if (typeof filters.min_length === 'number' && typeof filters.max_length === 'number') {
      where.length = Between(filters.min_length, filters.max_length);
    } else if (typeof filters.min_length === 'number') {
      where.length = Between(filters.min_length, Number.MAX_SAFE_INTEGER);
    } else if (typeof filters.max_length === 'number') {
      where.length = Between(0, filters.max_length);
    }

    // contains_character: search values containing that character
    // Using ILIKE to be case-insensitive
    if (filters.contains_character) {
      // We'll post-filter to be exact single char occurrence
      // but DB pre-filter helps performance
      // @ts-ignore typeorm type mismatch for ILike
      (where as any).value = ILike(`%${filters.contains_character}%`);
    }

    const data = await this.repo.find({ where, order: { created_at: 'DESC' } });

    // strict post-filter, if contains_character set
    const filtered = filters.contains_character
      ? data.filter((d) => d.value.includes(filters.contains_character!))
      : data;

    return { data: filtered, count: filtered.length };
  }
}
