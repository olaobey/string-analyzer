"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = {
    imports: [config_1.ConfigModule],
    useFactory: async (cfg) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: parseInt(cfg.get('DB_PORT', '5432')),
        username: cfg.get('DB_USER', 'postgres'),
        password: cfg.get('DB_PASSWORD', 'postgres'),
        database: cfg.get('DB_NAME', 'string_analyzer'),
        autoLoadEntities: true,
        synchronize: cfg.get('TYPEORM_SYNCHRONIZE', 'true') === 'true',
        logging: cfg.get('TYPEORM_LOGGING', 'false') === 'true',
    }),
    inject: [config_1.ConfigService],
};
