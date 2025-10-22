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
exports.StringsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const strings_service_1 = require("./strings.service");
const create_string_dto_1 = require("./dto/create-string.dto");
const query_strings_dto_1 = require("./dto/query-strings.dto");
let StringsController = class StringsController {
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return this.service.create(dto.value);
    }
    async getOne(value) {
        return this.service.getOneByValue(value);
    }
    async getAll(q) {
        return this.service.getAll(q);
    }
    async filterByNaturalLanguageViaQuery(query) {
        return this.service.filterByNaturalLanguage(query);
    }
    async delete(value) {
        await this.service.deleteByValue(value);
    }
};
exports.StringsController = StringsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ description: 'String analyzed and stored' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'String already exists in the system' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body or missing "value" field' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Invalid data type for "value" (must be string)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_string_dto_1.CreateStringDto]),
    __metadata("design:returntype", Promise)
], StringsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':string_value'),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns the analyzed string' }),
    __param(0, (0, common_1.Param)('string_value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StringsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'List of strings with optional filters' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid query parameter values or types' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_strings_dto_1.QueryStringsDto]),
    __metadata("design:returntype", Promise)
], StringsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('filter-by-natural-language/query'),
    (0, swagger_1.ApiOkResponse)({ description: 'Natural language filtered results' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Unable to parse natural language query' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Query parsed but resulted in conflicting filters' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StringsController.prototype, "filterByNaturalLanguageViaQuery", null);
__decorate([
    (0, common_1.Delete)(':string_value'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOkResponse)({ description: 'String successfully deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'String does not exist in the system' }),
    __param(0, (0, common_1.Param)('string_value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StringsController.prototype, "delete", null);
exports.StringsController = StringsController = __decorate([
    (0, swagger_1.ApiTags)('strings'),
    (0, common_1.Controller)({ path: 'strings', version: '1' }),
    __metadata("design:paramtypes", [strings_service_1.StringsService])
], StringsController);
