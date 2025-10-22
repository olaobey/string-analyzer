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
exports.StringsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const string_record_entity_1 = require("./entities/string-record.entity");
let StringsRepository = class StringsRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(record) {
        return this.repo.save(record);
    }
    async findByValue(value) {
        return this.repo.findOne({ where: { value } });
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async deleteByValue(value) {
        const res = await this.repo.delete({ value });
        return res.affected ?? 0;
    }
    async findAll(filters) {
        const where = {};
        if (typeof filters.is_palindrome === 'boolean') {
            where.is_palindrome = filters.is_palindrome;
        }
        if (typeof filters.word_count === 'number') {
            where.word_count = filters.word_count;
        }
        if (typeof filters.min_length === 'number' && typeof filters.max_length === 'number') {
            where.length = (0, typeorm_2.Between)(filters.min_length, filters.max_length);
        }
        else if (typeof filters.min_length === 'number') {
            where.length = (0, typeorm_2.Between)(filters.min_length, Number.MAX_SAFE_INTEGER);
        }
        else if (typeof filters.max_length === 'number') {
            where.length = (0, typeorm_2.Between)(0, filters.max_length);
        }
        // contains_character: search values containing that character
        // Using ILIKE to be case-insensitive
        if (filters.contains_character) {
            // We'll post-filter to be exact single char occurrence
            // but DB pre-filter helps performance
            // @ts-ignore typeorm type mismatch for ILike
            where.value = (0, typeorm_2.ILike)(`%${filters.contains_character}%`);
        }
        const data = await this.repo.find({ where, order: { created_at: 'DESC' } });
        // strict post-filter, if contains_character set
        const filtered = filters.contains_character
            ? data.filter((d) => d.value.includes(filters.contains_character))
            : data;
        return { data: filtered, count: filtered.length };
    }
};
exports.StringsRepository = StringsRepository;
exports.StringsRepository = StringsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(string_record_entity_1.StringRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StringsRepository);
