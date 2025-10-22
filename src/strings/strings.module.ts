import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringsController } from './strings.controller';
import { StringsService } from './strings.service';
import { StringRecord } from './entities/string-record.entity';
import { StringsRepository } from './strings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StringRecord])],
  controllers: [StringsController],
  providers: [StringsService, StringsRepository],
})
export class StringsModule {}
