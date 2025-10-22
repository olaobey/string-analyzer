/// <reference types="jest" />
import { computeProperties } from '../src/strings/util/compute-properties';

describe('computeProperties', () => {
  it('computes correct properties for a palindrome', () => {
    const value = 'Racecar';
    const p = computeProperties(value);
    expect(p.length).toBe(7);
    expect(p.is_palindrome).toBe(true);
    expect(p.word_count).toBe(1);
    expect(p.unique_characters).toBe(new Set([...value]).size);
    expect(p.character_frequency_map['R'] ?? p.character_frequency_map['r']).toBeDefined();
    expect(p.sha256_hash).toHaveLength(64);
  });

  it('handles whitespace word count', () => {
    const p = computeProperties('  foo   bar \n baz ');
    expect(p.word_count).toBe(3);
  });
});
