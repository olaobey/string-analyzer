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
        const qb = this.repo.createQueryBuilder('s').orderBy('s.created_at', 'DESC');
        const { is_palindrome, min_length, max_length, word_count, contains_character, } = filters ?? {};
        if (typeof is_palindrome === 'boolean') {
            qb.andWhere('s.is_palindrome = :is_palindrome', { is_palindrome });
        }
        if (typeof word_count === 'number') {
            qb.andWhere('s.word_count = :word_count', { word_count });
        }
        if (typeof min_length === 'number' && typeof max_length === 'number') {
            qb.andWhere('s.length BETWEEN :min AND :max', { min: min_length, max: max_length });
        }
        else if (typeof min_length === 'number') {
            qb.andWhere('s.length >= :min', { min: min_length });
        }
        else if (typeof max_length === 'number') {
            qb.andWhere('s.length <= :max', { max: max_length });
        }
        if (contains_character && contains_character.length > 0) {
            qb.andWhere('s.value ILIKE :needle', { needle: `%${contains_character}%` });
        }
        const [data, count] = await qb.getManyAndCount();
        return { data, count };
    }
};
exports.StringsRepository = StringsRepository;
exports.StringsRepository = StringsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(string_record_entity_1.StringRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StringsRepository);
