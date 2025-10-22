import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export default {
  imports: [ConfigModule],
  useFactory: async (cfg: ConfigService) => ({
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
  inject: [ConfigService],
} as TypeOrmModuleAsyncOptions;
