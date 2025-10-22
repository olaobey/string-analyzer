"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeProperties = computeProperties;
const crypto_1 = require("crypto");
function computeProperties(value) {
    const length = [...value].length;
    const lower = value.toLowerCase();
    const reversed = [...lower].reverse().join('');
    const is_palindrome = lower === reversed;
    const unique = new Set([...value]).size;
    const word_count = value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;
    const sha256_hash = (0, crypto_1.createHash)('sha256').update(value, 'utf8').digest('hex');
    const freq = {};
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
