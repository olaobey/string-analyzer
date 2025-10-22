import { NaturalLanguageParser } from '../src/strings/util/natural-language.parser';

describe('NaturalLanguageParser', () => {
  it('parses single word palindromic', () => {
    const { parsed } = NaturalLanguageParser.parse('all single word palindromic strings');
    expect(parsed.word_count).toBe(1);
    expect(parsed.is_palindrome).toBe(true);
  });

  it('parses longer than', () => {
    const { parsed } = NaturalLanguageParser.parse('strings longer than 10 characters');
    expect(parsed.min_length).toBe(11);
  });

  it('parses contains letter', () => {
    const { parsed } = NaturalLanguageParser.parse('strings containing the letter z');
    expect(parsed.contains_character).toBe('z');
  });
});
