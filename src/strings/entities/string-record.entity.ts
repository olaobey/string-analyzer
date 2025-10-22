import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'strings' })
export class StringRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'text', unique: true })
  value!: string;

  @Column({ type: 'int' })
  length!: number;

  @Column({ type: 'boolean' })
  is_palindrome!: boolean;

  @Column({ type: 'int' })
  unique_characters!: number;

  @Column({ type: 'int' })
  word_count!: number;

  @Column({ type: 'jsonb' })
  character_frequency_map!: Record<string, number>;

@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
created_at!: Date;
}
