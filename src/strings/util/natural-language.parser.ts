export type ParsedFilters = {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
};

export class NaturalLanguageParser {
  static parse(query: string): { parsed: ParsedFilters; reason?: string } {
    const q = (query ?? '').trim().toLowerCase();
    if (!q) return { parsed: {}, reason: 'empty query' };

    const parsed: ParsedFilters = {};
    let matched = false;

    if (/\bsingle\s+word\b/.test(q)) { parsed.word_count = 1; matched = true; }
    if (/\bpalindromic?\b/.test(q)) { parsed.is_palindrome = true; matched = true; }

    const longer = q.match(/\blonger\s+than\s+(\d+)\s+characters?\b/);
    if (longer) { parsed.min_length = Number(longer[1]) + 1; matched = true; }

    const shorter = q.match(/\bshorter\s+than\s+(\d+)\s+characters?\b/);
    if (shorter) {
      const n = Number(shorter[1]);
      if (Number.isFinite(n) && n > 0) { parsed.max_length = n - 1; matched = true; }
    }

    const contains =
      q.match(/\bcontain(?:ing)?\s+(?:the\s+letter\s+)?([a-z])\b/) ||
      q.match(/\bhas\s+letter\s+([a-z])\b/);
    if (contains) { parsed.contains_character = contains[1]; matched = true; }

    if (/\bfirst\s+vowel\b/.test(q)) { parsed.contains_character = 'a'; matched = true; }

    const nWord = q.match(/\b(\d+)[-\s]*word(s)?\b/);
    if (nWord) { parsed.word_count = Number(nWord[1]); matched = true; }

    if (
      parsed.min_length !== undefined &&
      parsed.max_length !== undefined &&
      parsed.min_length > parsed.max_length
    ) return { parsed: {}, reason: 'conflicting length filters' };

    if (parsed.contains_character && !/^[a-z]$/.test(parsed.contains_character))
      return { parsed: {}, reason: 'contains_character must be single a-z letter' };

    if (!matched) return { parsed: {}, reason: 'no recognizable filters' };

    return { parsed };
  }
}
