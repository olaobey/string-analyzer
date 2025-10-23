import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
    const qb: SelectQueryBuilder<StringRecord> =
      this.repo.createQueryBuilder('s').orderBy('s.created_at', 'DESC');

    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = filters ?? {};

    if (typeof is_palindrome === 'boolean') {
      qb.andWhere('s.is_palindrome = :is_palindrome', { is_palindrome });
    }
    if (typeof word_count === 'number') {
      qb.andWhere('s.word_count = :word_count', { word_count });
    }

    if (typeof min_length === 'number' && typeof max_length === 'number') {
      qb.andWhere('s.length BETWEEN :min AND :max', { min: min_length, max: max_length });
    } else if (typeof min_length === 'number') {
      qb.andWhere('s.length >= :min', { min: min_length });
    } else if (typeof max_length === 'number') {
      qb.andWhere('s.length <= :max', { max: max_length });
    }

    if (contains_character && contains_character.length > 0) {
      qb.andWhere('s.value ILIKE :needle', { needle: `%${contains_character}%` });
    }

    const [data, count] = await qb.getManyAndCount();
    return { data, count };
  }
}
