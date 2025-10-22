"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const string_record_entity_1 = require("./entities/string-record.entity");
const compute_properties_1 = require("./util/compute-properties");
const strings_repository_1 = require("./strings.repository");
const natural_language_parser_1 = require("./util/natural-language.parser");
let StringsService = class StringsService {
    constructor(repo, ormRepo) {
        this.repo = repo;
        this.ormRepo = ormRepo;
    }
    toResponse(record) {
        return {
            id: record.id,
            value: record.value,
            properties: {
                length: record.length,
                is_palindrome: record.is_palindrome,
                unique_characters: record.unique_characters,
                word_count: record.word_count,
                sha256_hash: record.id,
                character_frequency_map: record.character_frequency_map,
            },
            created_at: record.created_at.toISOString(),
        };
    }
    async create(value) {
        if (typeof value !== 'string') {
            throw new common_1.UnprocessableEntityException('Invalid data type for "value" (must be string)');
        }
        if (!value || !value.trim()) {
            throw new common_1.BadRequestException('Invalid request body or missing "value" field');
        }
        const props = (0, compute_properties_1.computeProperties)(value);
        // check if exists by value (unique)
        const existing = await this.repo.findByValue(value);
        if (existing)
            throw new common_1.ConflictException('String already exists in the system');
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
    async getOneByValue(rawPathParam) {
        // path may be URL-encoded; decode safely
        let value = rawPathParam;
        try {
            value = decodeURIComponent(rawPathParam);
        }
        catch {
            // keep original if decode fails
        }
        const rec = await this.repo.findByValue(value);
        if (!rec)
            throw new common_1.NotFoundException('String does not exist in the system');
        return this.toResponse(rec);
    }
    async getAll(q) {
        // Validate boolean string
        let isPal = undefined;
        if (q.is_palindrome !== undefined) {
            if (!['true', 'false'].includes(q.is_palindrome)) {
                throw new common_1.BadRequestException('Invalid query parameter values or types');
            }
            isPal = q.is_palindrome === 'true';
        }
        if ((q.min_length !== undefined && q.min_length < 0) ||
            (q.max_length !== undefined && q.max_length < 0) ||
            (q.word_count !== undefined && q.word_count < 0)) {
            throw new common_1.BadRequestException('Invalid query parameter values or types');
        }
        if (q.contains_character !== undefined && q.contains_character.length !== 1) {
            throw new common_1.BadRequestException('Invalid query parameter values or types');
        }
        if (q.min_length !== undefined &&
            q.max_length !== undefined &&
            q.min_length > q.max_length) {
            throw new common_1.BadRequestException('Invalid query parameter values or types');
        }
        const filters = {
            is_palindrome: isPal,
            min_length: q.min_length,
            max_length: q.max_length,
            word_count: q.word_count,
            contains_character: q.contains_character,
        };
        const { data, count } = await this.repo.findAll(filters);
        return {
            data: data.map((d) => this.toResponse(d)),
            count,
            filters_applied: {
                ...(isPal !== undefined ? { is_palindrome: isPal } : {}),
                ...(q.min_length !== undefined ? { min_length: q.min_length } : {}),
                ...(q.max_length !== undefined ? { max_length: q.max_length } : {}),
                ...(q.word_count !== undefined ? { word_count: q.word_count } : {}),
                ...(q.contains_character !== undefined
                    ? { contains_character: q.contains_character }
                    : {}),
            },
        };
    }
    async filterByNaturalLanguage(query) {
        const { parsed, reason } = natural_language_parser_1.NaturalLanguageParser.parse(query);
        if (reason && Object.keys(parsed).length === 0) {
            throw new common_1.BadRequestException('Unable to parse natural language query');
        }
        if (parsed.min_length !== undefined &&
            parsed.max_length !== undefined &&
            parsed.min_length > parsed.max_length) {
            throw new common_1.UnprocessableEntityException('Query parsed but resulted in conflicting filters');
        }
        const { data, count } = await this.repo.findAll(parsed);
        return {
            data: data.map((d) => this.toResponse(d)),
            count,
            interpreted_query: {
                original: query,
                parsed_filters: parsed,
            },
        };
    }
    async deleteByValue(rawPathParam) {
        let value = rawPathParam;
        try {
            value = decodeURIComponent(rawPathParam);
        }
        catch { }
        const affected = await this.repo.deleteByValue(value);
        if (affected === 0) {
            throw new common_1.NotFoundException('String does not exist in the system');
        }
        return; // 204
    }
};
exports.StringsService = StringsService;
exports.StringsService = StringsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(string_record_entity_1.StringRecord)),
    __metadata("design:paramtypes", [strings_repository_1.StringsRepository,
        typeorm_2.Repository])
], StringsService);
