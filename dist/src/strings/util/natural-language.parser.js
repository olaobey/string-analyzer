"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaturalLanguageParser = void 0;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
class NaturalLanguageParser {
    static parse(query) {
        const q = query.trim().toLowerCase();
        if (!q)
            return { parsed: {}, reason: 'empty query' };
        const parsed = {};
        // 1) "all single word palindromic strings"
        if (/single\s+word/.test(q))
            parsed.word_count = 1;
        if (/\bpalindromic?\b/.test(q))
            parsed.is_palindrome = true;
        // 2) "strings longer than 10 characters"
        const longerThan = q.match(/longer\s+than\s+(\d+)\s+character/);
        if (longerThan)
            parsed.min_length = Number(longerThan[1]) + 1;
        // 3) "strings containing the letter z"
        const containsLetter = q.match(/contain(?:ing)?\s+(?:the\s+letter\s+)?([a-z0-9])/);
        if (containsLetter)
            parsed.contains_character = containsLetter[1];
        // 4) "palindromic strings that contain the first vowel"
        if (/first\s+vowel/.test(q))
            parsed.contains_character = 'a';
        // 5) "strings shorter than N characters"
        const shorterThan = q.match(/shorter\s+than\s+(\d+)\s+character/);
        if (shorterThan)
            parsed.max_length = Number(shorterThan[1]) - 1;
        // 6) exact word count e.g. "two-word strings" (treat as 2 words)
        const nWord = q.match(/(\d+)[-\s]*word/);
        if (nWord)
            parsed.word_count = Number(nWord[1]);
        // sanity/conflicts
        if (parsed.min_length !== undefined &&
            parsed.max_length !== undefined &&
            parsed.min_length > parsed.max_length) {
            return { parsed: {}, reason: 'conflicting length filters' };
        }
        // If parser found nothing meaningful, return failure context
        const foundSomething = Object.keys(parsed).length > 0;
        if (!foundSomething) {
            return { parsed: {}, reason: 'no recognizable filters' };
        }
        // contains_character should be single char
        if (parsed.contains_character && parsed.contains_character.length !== 1) {
            return { parsed: {}, reason: 'contains_character must be single char' };
        }
        // Normalize vowel heuristic if asked ambiguously
        if (parsed.contains_character && !VOWELS.includes(parsed.contains_character)) {
            // OK, could be consonant; keep as-is
        }
        return { parsed };
    }
}
exports.NaturalLanguageParser = NaturalLanguageParser;
