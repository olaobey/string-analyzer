"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const strings_controller_1 = require("./strings.controller");
const strings_service_1 = require("./strings.service");
const string_record_entity_1 = require("./entities/string-record.entity");
const strings_repository_1 = require("./strings.repository");
let StringsModule = class StringsModule {
};
exports.StringsModule = StringsModule;
exports.StringsModule = StringsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([string_record_entity_1.StringRecord])],
        controllers: [strings_controller_1.StringsController],
        providers: [strings_service_1.StringsService, strings_repository_1.StringsRepository],
    })
], StringsModule);
