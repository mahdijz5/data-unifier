import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { JobOfferEntity } from './entities/job-offer.entity';
import { CompanyEntity } from './entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      entities: [JobOfferEntity, CompanyEntity],
      // logging: 'all',
      synchronize: true,
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
