import { createHash } from 'crypto';

export type ComputedProps = {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
};

export function computeProperties(value: string): ComputedProps {
  const length = [...value].length; 
  const lower = value.toLowerCase();
  const reversed = [...lower].reverse().join('');
  const is_palindrome = lower === reversed; 

  const unique = new Set([...value]).size;

  const word_count = value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;

  const sha256_hash = createHash('sha256').update(value, 'utf8').digest('hex');

  const freq: Record<string, number> = {};
  for (const ch of [...value]) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters: unique,
    word_count,
    sha256_hash,
    character_frequency_map: freq,
  };
}
